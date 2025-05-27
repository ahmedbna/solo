import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// Query to get all trips for an agency
export const getAgencyTrips = query({
  args: {
    agencyId: v.id('agencies'),
    status: v.optional(
      v.union(v.literal('draft'), v.literal('active'), v.literal('archived'))
    ),
    type: v.optional(
      v.union(v.literal('domestic'), v.literal('international'))
    ),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Check if user is a member of the agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!member) {
      throw new Error('Not authorized to view trips for this agency');
    }

    let tripsQuery = ctx.db
      .query('trips')
      .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId));

    if (args.status) {
      tripsQuery = ctx.db
        .query('trips')
        .withIndex('by_agency_status', (q) =>
          q.eq('agencyId', args.agencyId).eq('status', args.status!)
        );
    }

    if (args.type) {
      tripsQuery = ctx.db
        .query('trips')
        .withIndex('by_agency_type', (q) =>
          q.eq('agencyId', args.agencyId).eq('type', args.type!)
        );
    }

    let trips = await tripsQuery.collect();

    // Filter by country if specified
    if (args.country) {
      trips = trips.filter((trip) => trip.country === args.country);
    }

    return trips;
  },
});

// Query to get a single trip by ID
export const getTripById = query({
  args: { id: v.id('trips') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const trip = await ctx.db.get(args.id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if user is a member of the agency that owns this trip
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', trip.agencyId).eq('userId', userId)
      )
      .first();

    if (!member) {
      throw new Error('Not authorized to view this trip');
    }

    return trip;
  },
});

// Query to get trips by country
export const getTripsByCountry = query({
  args: {
    country: v.string(),
    agencyId: v.optional(v.id('agencies')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    let trips = await ctx.db
      .query('trips')
      .withIndex('by_country', (q) => q.eq('country', args.country))
      .collect();

    // Filter by agency if specified
    if (args.agencyId) {
      // Check if user is a member of the agency
      const member = await ctx.db
        .query('members')
        .withIndex('by_agency_user', (q) =>
          q.eq('agencyId', args.agencyId!).eq('userId', userId)
        )
        .first();

      if (!member) {
        throw new Error('Not authorized to view trips for this agency');
      }

      trips = trips.filter((trip) => trip.agencyId === args.agencyId);
    }

    return trips;
  },
});

// Query to get trips created by a specific user
export const getTripsByCreator = query({
  args: { creatorId: v.id('users') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Users can only see their own created trips or trips from agencies they're members of
    const trips = await ctx.db
      .query('trips')
      .withIndex('by_creator', (q) => q.eq('createdBy', args.creatorId))
      .collect();

    // Filter trips to only include those from agencies the user is a member of
    const userMemberships = await ctx.db
      .query('members')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const agencyIds = userMemberships.map((m) => m.agencyId);

    return trips.filter((trip) => agencyIds.includes(trip.agencyId));
  },
});

// Query to search trips
export const searchTrips = query({
  args: {
    agencyId: v.id('agencies'),
    searchTerm: v.string(),
    type: v.optional(
      v.union(v.literal('domestic'), v.literal('international'))
    ),
    status: v.optional(
      v.union(v.literal('draft'), v.literal('active'), v.literal('archived'))
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Check if user is a member of the agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!member) {
      throw new Error('Not authorized to search trips for this agency');
    }

    let trips = await ctx.db
      .query('trips')
      .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
      .collect();

    // Apply filters
    if (args.type) {
      trips = trips.filter((trip) => trip.type === args.type);
    }

    if (args.status) {
      trips = trips.filter((trip) => trip.status === args.status);
    }

    // Search in title, description, destinations, and country
    const searchTerm = args.searchTerm.toLowerCase();
    trips = trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(searchTerm) ||
        trip.description?.toLowerCase().includes(searchTerm) ||
        trip.country?.toLowerCase().includes(searchTerm) ||
        trip.destinations?.some((dest) =>
          dest.toLowerCase().includes(searchTerm)
        )
    );

    return trips;
  },
});

// Mutation to create a new trip
export const createTrip = mutation({
  args: {
    agencyId: v.id('agencies'),
    title: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    country: v.string(),
    destinations: v.array(v.string()),
    inclusions: v.array(v.string()),
    exclusions: v.array(v.string()),
    basePrice: v.number(),
    type: v.union(v.literal('domestic'), v.literal('international')),
    itinerary: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        dayNumber: v.number(),
        images: v.array(v.string()),
        city: v.optional(v.string()),
        country: v.optional(v.string()),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        activityType: v.optional(v.string()),
        estimatedDuration: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Check if user has permission to create trips for this agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!member || !member.permissions.canCreateTrips) {
      throw new Error('Not authorized to create trips for this agency');
    }

    const tripId = await ctx.db.insert('trips', {
      agencyId: args.agencyId,
      createdBy: userId,
      title: args.title,
      description: args.description,
      images: args.images,
      country: args.country,
      destinations: args.destinations,
      inclusions: args.inclusions,
      exclusions: args.exclusions,
      basePrice: args.basePrice,
      type: args.type,
      status: 'draft',
      itinerary: args.itinerary,
    });

    return tripId;
  },
});

// Mutation to update a trip
export const updateTrip = mutation({
  args: {
    id: v.id('trips'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    country: v.optional(v.string()),
    destinations: v.optional(v.array(v.string())),
    inclusions: v.optional(v.array(v.string())),
    exclusions: v.optional(v.array(v.string())),
    basePrice: v.optional(v.number()),
    type: v.optional(
      v.union(v.literal('domestic'), v.literal('international'))
    ),
    status: v.optional(
      v.union(v.literal('draft'), v.literal('active'), v.literal('archived'))
    ),
    itinerary: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
          dayNumber: v.number(),
          images: v.array(v.string()),
          city: v.optional(v.string()),
          country: v.optional(v.string()),
          latitude: v.optional(v.number()),
          longitude: v.optional(v.number()),
          activityType: v.optional(v.string()),
          estimatedDuration: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const trip = await ctx.db.get(args.id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if user has permission to edit trips for this agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', trip.agencyId).eq('userId', userId)
      )
      .first();

    if (!member || !member.permissions.canEditTrips) {
      throw new Error('Not authorized to edit this trip');
    }

    const updateData: any = {};

    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined)
      updateData.description = args.description;
    if (args.images !== undefined) updateData.images = args.images;
    if (args.country !== undefined) updateData.country = args.country;
    if (args.destinations !== undefined)
      updateData.destinations = args.destinations;
    if (args.inclusions !== undefined) updateData.inclusions = args.inclusions;
    if (args.exclusions !== undefined) updateData.exclusions = args.exclusions;
    if (args.basePrice !== undefined) updateData.basePrice = args.basePrice;
    if (args.type !== undefined) updateData.type = args.type;
    if (args.status !== undefined) updateData.status = args.status;
    if (args.itinerary !== undefined) updateData.itinerary = args.itinerary;

    await ctx.db.patch(args.id, updateData);
    return args.id;
  },
});

// Mutation to delete a trip
export const deleteTrip = mutation({
  args: { id: v.id('trips') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const trip = await ctx.db.get(args.id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if user has permission to delete trips for this agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', trip.agencyId).eq('userId', userId)
      )
      .first();

    if (!member || !member.permissions.canDeleteTrips) {
      throw new Error('Not authorized to delete this trip');
    }

    // Check if there are any active waves or bookings for this trip
    const activeWaves = await ctx.db
      .query('waves')
      .withIndex('by_tripId_status', (q) =>
        q.eq('tripId', args.id).eq('status', 'active')
      )
      .collect();

    if (activeWaves.length > 0) {
      throw new Error('Cannot delete trip with active waves');
    }

    const bookings = await ctx.db
      .query('bookings')
      .withIndex('by_trip', (q) => q.eq('tripId', args.id))
      .collect();

    if (bookings.length > 0) {
      throw new Error('Cannot delete trip with existing bookings');
    }

    // Delete all waves for this trip first
    const allWaves = await ctx.db
      .query('waves')
      .withIndex('by_tripId', (q) => q.eq('tripId', args.id))
      .collect();

    for (const wave of allWaves) {
      await ctx.db.delete(wave._id);
    }

    // Delete the trip
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Mutation to archive a trip
export const archiveTrip = mutation({
  args: { id: v.id('trips') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const trip = await ctx.db.get(args.id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if user has permission to edit trips for this agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', trip.agencyId).eq('userId', userId)
      )
      .first();

    if (!member || !member.permissions.canEditTrips) {
      throw new Error('Not authorized to archive this trip');
    }

    await ctx.db.patch(args.id, { status: 'archived' });
    return args.id;
  },
});

// Mutation to activate a trip
export const activateTrip = mutation({
  args: { id: v.id('trips') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const trip = await ctx.db.get(args.id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if user has permission to edit trips for this agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', trip.agencyId).eq('userId', userId)
      )
      .first();

    if (!member || !member.permissions.canEditTrips) {
      throw new Error('Not authorized to activate this trip');
    }

    await ctx.db.patch(args.id, { status: 'active' });
    return args.id;
  },
});

// Mutation to duplicate a trip
export const duplicateTrip = mutation({
  args: {
    id: v.id('trips'),
    newTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const originalTrip = await ctx.db.get(args.id);
    if (!originalTrip) {
      throw new Error('Trip not found');
    }

    // Check if user has permission to create trips for this agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', originalTrip.agencyId).eq('userId', userId)
      )
      .first();

    if (!member || !member.permissions.canCreateTrips) {
      throw new Error('Not authorized to duplicate trips for this agency');
    }

    const newTripId = await ctx.db.insert('trips', {
      agencyId: originalTrip.agencyId,
      createdBy: userId,
      title: args.newTitle || `${originalTrip.title} (Copy)`,
      description: originalTrip.description,
      images: originalTrip.images,
      country: originalTrip.country,
      destinations: originalTrip.destinations,
      inclusions: originalTrip.inclusions,
      exclusions: originalTrip.exclusions,
      basePrice: originalTrip.basePrice,
      type: originalTrip.type,
      status: 'draft',
      itinerary: originalTrip.itinerary,
    });

    return newTripId;
  },
});

// Query to get trip statistics for an agency
export const getTripStats = query({
  args: { agencyId: v.id('agencies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Check if user is a member of the agency
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!member) {
      throw new Error('Not authorized to view stats for this agency');
    }

    const trips = await ctx.db
      .query('trips')
      .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
      .collect();

    const stats = {
      total: trips.length,
      active: trips.filter((t) => t.status === 'active').length,
      draft: trips.filter((t) => t.status === 'draft').length,
      archived: trips.filter((t) => t.status === 'archived').length,
      domestic: trips.filter((t) => t.type === 'domestic').length,
      international: trips.filter((t) => t.type === 'international').length,
      countries: [...new Set(trips.map((t) => t.country))].length,
    };

    return stats;
  },
});

// Query to get trip with waves and booking count
export const getTripWithDetails = query({
  args: { id: v.id('trips') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const trip = await ctx.db.get(args.id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if user is a member of the agency that owns this trip
    const member = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', trip.agencyId).eq('userId', userId)
      )
      .first();

    if (!member) {
      throw new Error('Not authorized to view this trip');
    }

    // Get waves for this trip
    const waves = await ctx.db
      .query('waves')
      .withIndex('by_tripId', (q) => q.eq('tripId', args.id))
      .collect();

    // Get booking count for this trip
    const bookings = await ctx.db
      .query('bookings')
      .withIndex('by_trip', (q) => q.eq('tripId', args.id))
      .collect();

    return {
      ...trip,
      waves,
      bookingCount: bookings.length,
      totalRevenue: bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
      ),
    };
  },
});
