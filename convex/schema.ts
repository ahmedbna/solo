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
    name: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),
        postalCode: v.optional(v.string()),
      })
    ),
    // Business information
    businessType: v.string(),
    licenseNumber: v.optional(v.string()),
    // Agency settings
    settings: v.object({
      currency: v.string(), // Default currency
      timezone: v.string(),
      language: v.string(),
      bookingPrefix: v.string(), // Prefix for booking numbers
      commissionRate: v.optional(v.number()), // Default commission percentage
      // Feature toggles
      features: v.object({
        multiCityBookings: v.boolean(),
        groupBookings: v.boolean(),
        customItineraries: v.boolean(),
        priceManagement: v.boolean(),
        analyticsReporting: v.boolean(),
        apiAccess: v.boolean(),
      }),
    }),
    ownerId: v.id('users'), // Agency owner
    isActive: v.boolean(),
    updatedAt: v.number(),
  })
    .index('by_owner', ['ownerId'])
    .index('by_status', ['isActive'])
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
    description: v.string(),
    images: v.array(v.string()),

    country: v.string(),
    destinations: v.array(v.string()), // e.g., "US"

    inclusions: v.array(v.string()),
    exclusions: v.array(v.string()),
    basePrice: v.number(),
    type: v.union(v.literal('domestic'), v.literal('international')),
    status: v.union(
      v.literal('draft'),
      v.literal('active'),
      v.literal('archived')
    ),
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
    // Reference to the base trip template
    tripTemplateId: v.id('tripTemplates'),

    // Wave-specific details
    waveName: v.optional(v.string()), // e.g., "October Wave", "Holiday Special"
    waveNumber: v.number(), // 1, 2, 3, etc.

    // Wave-specific dates
    startDate: v.number(),
    endDate: v.number(),
    registrationDeadline: v.optional(v.number()),

    // Wave-specific capacity and pricing
    capacity: v.number(),
    availableSpots: v.number(),
    pricePerPerson: v.number(), // Can override base price
    priceModifier: v.optional(v.number()), // Percentage modifier from base price

    // Wave-specific modifications (optional overrides)
    modifications: v.optional(
      v.object({
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        inclusions: v.optional(v.array(v.string())),
        exclusions: v.optional(v.array(v.string())),
        itineraryChanges: v.optional(
          v.array(
            v.object({
              dayNumber: v.number(),
              changes: v.string(),
            })
          )
        ),
      })
    ),

    // Wave status
    status: v.union(
      v.literal('scheduled'),
      v.literal('open_for_booking'),
      v.literal('booking_closed'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('cancelled')
    ),

    // Booking and traveler management
    totalBookings: v.number(),
    totalTravelers: v.number(),

    // Agency assignment (can override template assignment)
    assignedTo: v.optional(v.array(v.id('users'))),

    updatedAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_template', ['tripTemplateId'])
    .index('by_template_status', ['tripTemplateId', 'status'])
    .index('by_start_date', ['startDate'])
    .index('by_end_date', ['endDate'])
    .index('by_date_range', ['startDate', 'endDate'])
    .index('by_status', ['status'])
    .index('by_capacity', ['capacity'])
    .index('by_available_spots', ['availableSpots'])
    .index('by_price', ['pricePerPerson'])
    .index('by_registration_deadline', ['registrationDeadline'])
    .index('by_wave_number', ['tripTemplateId', 'waveNumber'])
    .index('by_updated', ['updatedAt'])
    .index('template_dates', ['tripTemplateId', 'startDate']),

  // Bookings with agency context
  bookings: defineTable({
    tripId: v.id('trips'),
    agencyId: v.id('agencies'),
    customerId: v.optional(v.id('users')), // If customer has an account
    agentId: v.id('users'), // Agent who created the booking

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

    // Booking details
    numberOfTravelers: v.number(),
    travelers: v.array(
      v.object({
        firstName: v.string(),
        lastName: v.string(),
        dateOfBirth: v.optional(v.string()),
        passportNumber: v.optional(v.string()),
        specialRequests: v.optional(v.string()),
      })
    ),

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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_agency', ['agencyId'])
    .index('by_trip', ['tripId'])
    .index('by_agent', ['agentId'])
    .index('by_customer', ['customer.email'])
    .index('by_status', ['status'])
    .index('by_reference', ['bookingReference']),
});
