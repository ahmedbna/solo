import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    isAnonymous: v.optional(v.boolean()),
    heartbeat: v.optional(v.float64()),
  }).index('email', ['email']),

  // Travel agencies that users can create and manage
  agencies: defineTable({
    ownerId: v.id('users'),
    name: v.string(),
    bio: v.optional(v.string()),
    logo: v.optional(
      v.array(
        v.object({
          fileName: v.string(),
          fileUrl: v.string(),
          name: v.string(),
          size: v.number(),
          type: v.string(),
          response: v.any(),
        })
      )
    ),
    images: v.optional(
      v.array(
        v.object({
          fileName: v.string(),
          fileUrl: v.string(),
          name: v.string(),
          size: v.number(),
          type: v.string(),
          response: v.any(),
        })
      )
    ),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    socialMedia: v.optional(
      v.object({
        facebook: v.optional(v.string()),
        instagram: v.optional(v.string()),
        twitter: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        youtube: v.optional(v.string()),
      })
    ),
    taxId: v.optional(v.string()),
  })
    .index('by_owner', ['ownerId'])
    .index('by_name', ['name']),

  // Agency members and their roles
  members: defineTable({
    agencyId: v.id('agencies'),
    userId: v.id('users'),
    role: v.union(
      v.literal('owner'), // Full access, can manage agency and members
      v.literal('admin'), // Can manage trips, bookings, and view analytics
      v.literal('manager'), // Can create/edit trips and manage bookings
      v.literal('agent'), // Can create bookings and view assigned trips
      v.literal('editor'), // Can edit trip content but not pricing
      v.literal('viewer') // Read-only access to trips and basic analytics
    ),
    permissions: v.object({
      // Trip management
      canCreateTrips: v.boolean(),
      canEditTrips: v.boolean(),
      canDeleteTrips: v.boolean(),
      canManagePricing: v.boolean(),
      // Booking management
      canCreateBookings: v.boolean(),
      canEditBookings: v.boolean(),
      canCancelBookings: v.boolean(),
      canProcessPayments: v.boolean(),
      // Agency management
      canManageMembers: v.boolean(),
      canManageSettings: v.boolean(),
      canViewAnalytics: v.boolean(),
      canExportData: v.boolean(),
      // Content management
      canManageLocations: v.boolean(),
      canManageItineraries: v.boolean(),
    }),
    // Assignment restrictions
    assignedRegions: v.optional(v.array(v.string())), // Regions they can manage
    assignedTripTypes: v.optional(v.array(v.string())), // Trip types they can access
    // Status and metadata
    status: v.union(
      v.literal('active'),
      v.literal('inactive'),
      v.literal('pending') // For invitations
    ),
    invitedBy: v.optional(v.id('users')),
    invitedAt: v.optional(v.number()),
    joinedAt: v.optional(v.number()),
    lastActiveAt: v.optional(v.number()),
  })
    .index('by_agency', ['agencyId'])
    .index('by_user', ['userId'])
    .index('by_agency_user', ['agencyId', 'userId'])
    .index('by_role', ['agencyId', 'role'])
    .index('by_status', ['status']),

  // Member invitations
  invitations: defineTable({
    agencyId: v.id('agencies'),
    email: v.string(),
    role: v.string(),
    permissions: v.object({
      canCreateTrips: v.boolean(),
      canEditTrips: v.boolean(),
      canDeleteTrips: v.boolean(),
      canManagePricing: v.boolean(),
      canCreateBookings: v.boolean(),
      canEditBookings: v.boolean(),
      canCancelBookings: v.boolean(),
      canProcessPayments: v.boolean(),
      canManageMembers: v.boolean(),
      canManageSettings: v.boolean(),
      canViewAnalytics: v.boolean(),
      canExportData: v.boolean(),
      canManageLocations: v.boolean(),
      canManageItineraries: v.boolean(),
    }),
    invitedBy: v.id('users'),
    token: v.string(), // Unique invitation token
    expiresAt: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('accepted'),
      v.literal('expired'),
      v.literal('canceled')
    ),
    createdAt: v.number(),
  })
    .index('by_agency', ['agencyId'])
    .index('by_email', ['email'])
    .index('by_token', ['token'])
    .index('by_status', ['status']),

  // Trip template - the base trip that can have multiple waves
  trips: defineTable({
    agencyId: v.id('agencies'),
    createdBy: v.id('users'),
    title: v.string(),
    type: v.union(v.literal('domestic'), v.literal('international')),

    description: v.optional(v.string()),
    images: v.optional(v.array(v.string())),

    country: v.optional(v.string()), // e.g., "US"
    destinations: v.optional(v.array(v.string())), // e.g., "US"

    inclusions: v.optional(v.array(v.string())),
    exclusions: v.optional(v.array(v.string())),
    basePrice: v.number(),
    status: v.union(
      v.literal('draft'),
      v.literal('active'),
      v.literal('archived')
    ),

    itinerary: v.optional(
      v.array(
        v.object({
          title: v.optional(v.string()),
          description: v.optional(v.string()),
          dayNumber: v.number(),
          images: v.optional(v.array(v.string())),
          city: v.optional(v.string()),
          country: v.optional(v.string()),
          latitude: v.optional(v.number()),
          longitude: v.optional(v.number()),
          activityType: v.optional(v.string()),
          estimatedDuration: v.optional(v.string()),
        })
      )
    ),
  })
    .index('by_type', ['type'])
    .index('by_status', ['status'])
    .index('by_agency', ['agencyId'])
    .index('by_country', ['country'])
    .index('by_creator', ['createdBy'])
    .index('by_agency_type', ['agencyId', 'type'])
    .index('by_agency_status', ['agencyId', 'status']),

  // Trip waves - specific instances of a trip template
  waves: defineTable({
    tripId: v.id('trips'),
    title: v.optional(v.string()), // e.g., "October Wave", "Holiday Special"
    version: v.number(), // 1, 2, 3, etc.
    startDate: v.number(),
    endDate: v.number(),
    registrationDeadline: v.optional(v.number()),
    capacity: v.number(),
    availableSpots: v.number(),
    pricePerPerson: v.number(), // Can override base price
    status: v.union(
      v.literal('active'),
      v.literal('draft'),
      v.literal('archived'),
      v.literal('cancelled')
    ),
  })
    .index('by_tripId', ['tripId'])
    .index('by_tripId_status', ['tripId', 'status'])
    .index('by_start_date', ['startDate'])
    .index('by_end_date', ['endDate'])
    .index('by_date_range', ['startDate', 'endDate'])
    .index('by_status', ['status']),

  // Bookings with agency context
  bookings: defineTable({
    tripId: v.id('trips'),
    agencyId: v.id('agencies'),
    customerId: v.optional(v.id('users')), // If customer has an account

    // Customer information
    customer: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
      dateOfBirth: v.optional(v.string()),
      nationality: v.optional(v.string()),
      passportNumber: v.optional(v.string()),
      specialRequests: v.optional(v.string()),
    }),

    // Pricing
    totalAmount: v.number(),
    paidAmount: v.number(),
    currency: v.string(),
    paymentStatus: v.union(
      v.literal('pending'),
      v.literal('partial'),
      v.literal('paid'),
      v.literal('refunded'),
      v.literal('failed')
    ),

    // Status
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('canceled'),
      v.literal('completed')
    ),

    bookingReference: v.string(),
    notes: v.optional(v.string()),
  })
    .index('by_agency', ['agencyId'])
    .index('by_trip', ['tripId'])
    .index('by_customer', ['customer.email'])
    .index('by_status', ['status'])
    .index('by_reference', ['bookingReference']),
});
