import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// Create a new agency
export const createAgency = mutation({
  args: {
    name: v.string(),
    bio: v.optional(v.string()),
    logo: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    // Create the agency
    const agencyId = await ctx.db.insert('agencies', {
      ownerId: userId,
      ...args,
    });

    // Create owner membership
    await ctx.db.insert('members', {
      agencyId,
      userId,
      role: 'owner',
      permissions: {
        canCreateTrips: true,
        canEditTrips: true,
        canDeleteTrips: true,
        canManagePricing: true,
        canCreateBookings: true,
        canEditBookings: true,
        canCancelBookings: true,
        canProcessPayments: true,
        canManageMembers: true,
        canManageSettings: true,
        canViewAnalytics: true,
        canExportData: true,
        canManageLocations: true,
        canManageItineraries: true,
      },
      status: 'active',
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
    });

    return agencyId;
  },
});

// Get agency by ID
export const getAgency = query({
  args: { agencyId: v.id('agencies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const agency = await ctx.db.get(args.agencyId);
    if (!agency) throw new Error('Agency not found');

    // Check if user is a member
    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!membership) throw new Error('Access denied');

    return agency;
  },
});

// Get agencies for current user
export const getUserAgencies = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error('Authentication required');

    const memberships = await ctx.db
      .query('members')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    const results = await Promise.all(
      memberships.map(async (membership) => {
        const agency = await ctx.db.get(membership.agencyId);
        return agency ? { ...agency, role: membership.role } : null;
      })
    );

    const agencies = results.filter((agency) => agency !== null);

    return agencies;
  },
});

// Update agency
export const updateAgency = mutation({
  args: {
    agencyId: v.id('agencies'),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    logo: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const { agencyId, ...updates } = args;

    // Check permissions
    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', agencyId).eq('userId', userId)
      )
      .first();

    if (!membership || !membership.permissions.canManageSettings) {
      throw new Error('Insufficient permissions');
    }

    await ctx.db.patch(agencyId, updates);
    return { success: true };
  },
});

// Delete agency
export const deleteAgency = mutation({
  args: { agencyId: v.id('agencies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const agency = await ctx.db.get(args.agencyId);
    if (!agency) throw new Error('Agency not found');

    // Only owner can delete
    if (agency.ownerId !== userId) {
      throw new Error('Only agency owner can delete the agency');
    }

    // Delete all related data
    const members = await ctx.db
      .query('members')
      .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
      .collect();

    const invitations = await ctx.db
      .query('invitations')
      .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
      .collect();

    // Delete members
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete invitations
    for (const invitation of invitations) {
      await ctx.db.delete(invitation._id);
    }

    // Delete agency
    await ctx.db.delete(args.agencyId);
    return { success: true };
  },
});

// ==================== MEMBER MANAGEMENT ====================

// Get agency members
export const getAgencyMembers = query({
  args: { agencyId: v.id('agencies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    // Check if user is a member
    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!membership) throw new Error('Access denied');

    const members = await ctx.db
      .query('members')
      .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
      .collect();

    const membersWithUserInfo = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user
            ? {
                name: user.name,
                email: user.email,
                image: user.image,
              }
            : null,
        };
      })
    );

    return membersWithUserInfo;
  },
});

// Invite member
export const inviteMember = mutation({
  args: {
    agencyId: v.id('agencies'),
    email: v.string(),
    role: v.union(
      v.literal('admin'),
      v.literal('manager'),
      v.literal('agent'),
      v.literal('editor'),
      v.literal('viewer')
    ),
    permissions: v.optional(
      v.object({
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
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    // Check permissions
    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!membership || !membership.permissions.canManageMembers) {
      throw new Error('Insufficient permissions');
    }

    // Check if user is already a member
    const existingUser = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();

    if (existingUser) {
      const existingMember = await ctx.db
        .query('members')
        .withIndex('by_agency_user', (q) =>
          q.eq('agencyId', args.agencyId).eq('userId', existingUser._id)
        )
        .first();

      if (existingMember) {
        throw new Error('User is already a member of this agency');
      }
    }

    // Check for existing invitation
    const existingInvitation = await ctx.db
      .query('invitations')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .filter((q) =>
        q.and(
          q.eq(q.field('agencyId'), args.agencyId),
          q.eq(q.field('status'), 'pending')
        )
      )
      .first();

    if (existingInvitation) {
      throw new Error('Invitation already sent to this email');
    }

    // Default permissions based on role
    const defaultPermissions = getDefaultPermissions(args.role);
    const permissions = args.permissions || defaultPermissions;

    // Generate invitation token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const invitationId = await ctx.db.insert('invitations', {
      agencyId: args.agencyId,
      email: args.email,
      role: args.role,
      permissions,
      invitedBy: userId,
      token,
      expiresAt,
      status: 'pending',
      createdAt: Date.now(),
    });

    return { invitationId, token };
  },
});

// Accept invitation
export const acceptInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const invitation = await ctx.db
      .query('invitations')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!invitation) throw new Error('Invalid invitation token');

    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer valid');
    }

    if (invitation.expiresAt < Date.now()) {
      await ctx.db.patch(invitation._id, { status: 'expired' });
      throw new Error('Invitation has expired');
    }

    const user = await ctx.db.get(userId);
    if (!user || user.email !== invitation.email) {
      throw new Error('Invitation email does not match your account');
    }

    // Create membership
    await ctx.db.insert('members', {
      agencyId: invitation.agencyId,
      userId,
      role: invitation.role as any,
      permissions: invitation.permissions,
      status: 'active',
      invitedBy: invitation.invitedBy,
      invitedAt: invitation.createdAt,
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
    });

    // Update invitation status
    await ctx.db.patch(invitation._id, { status: 'accepted' });

    return { success: true };
  },
});

// Update member role and permissions
export const updateMember = mutation({
  args: {
    memberId: v.id('members'),
    role: v.optional(
      v.union(
        v.literal('admin'),
        v.literal('manager'),
        v.literal('agent'),
        v.literal('editor'),
        v.literal('viewer')
      )
    ),
    permissions: v.optional(
      v.object({
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
      })
    ),
    assignedRegions: v.optional(v.array(v.string())),
    assignedTripTypes: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal('active'), v.literal('inactive'))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error('Member not found');

    // Check permissions
    const currentUserMembership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', member.agencyId).eq('userId', userId)
      )
      .first();

    if (
      !currentUserMembership ||
      !currentUserMembership.permissions.canManageMembers
    ) {
      throw new Error('Insufficient permissions');
    }

    // Can't modify owner
    if (member.role === 'owner') {
      throw new Error('Cannot modify owner role');
    }

    const { memberId, ...updates } = args;
    await ctx.db.patch(memberId, updates);

    return { success: true };
  },
});

// Remove member
export const removeMember = mutation({
  args: { memberId: v.id('members') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error('Member not found');

    // Check permissions
    const currentUserMembership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', member.agencyId).eq('userId', userId)
      )
      .first();

    if (
      !currentUserMembership ||
      !currentUserMembership.permissions.canManageMembers
    ) {
      throw new Error('Insufficient permissions');
    }

    // Can't remove owner
    if (member.role === 'owner') {
      throw new Error('Cannot remove agency owner');
    }

    await ctx.db.delete(args.memberId);
    return { success: true };
  },
});

// Leave agency
export const leaveAgency = mutation({
  args: { agencyId: v.id('agencies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!membership) throw new Error('You are not a member of this agency');

    // Owner cannot leave (must transfer ownership first)
    if (membership.role === 'owner') {
      throw new Error('Owner cannot leave agency. Transfer ownership first.');
    }

    await ctx.db.delete(membership._id);
    return { success: true };
  },
});

// ==================== INVITATION MANAGEMENT ====================

// Get agency invitations
export const getAgencyInvitations = query({
  args: { agencyId: v.id('agencies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    // Check permissions
    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!membership || !membership.permissions.canManageMembers) {
      throw new Error('Insufficient permissions');
    }

    return await ctx.db
      .query('invitations')
      .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
      .collect();
  },
});

// Cancel invitation
export const cancelInvitation = mutation({
  args: { invitationId: v.id('invitations') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) throw new Error('Invitation not found');

    // Check permissions
    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', invitation.agencyId).eq('userId', userId)
      )
      .first();

    if (!membership || !membership.permissions.canManageMembers) {
      throw new Error('Insufficient permissions');
    }

    await ctx.db.patch(args.invitationId, { status: 'canceled' });
    return { success: true };
  },
});

// Get user's pending invitations
export const getUserInvitations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    const user = await ctx.db.get(userId);
    if (!user || !user.email) return [];

    const invitations = await ctx.db
      .query('invitations')
      .withIndex('by_email', (q) => q.eq('email', user.email!))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .collect();

    // Add agency info to invitations
    const invitationsWithAgency = await Promise.all(
      invitations.map(async (invitation) => {
        const agency = await ctx.db.get(invitation.agencyId);
        const invitedByUser = await ctx.db.get(invitation.invitedBy);
        return {
          ...invitation,
          agency: agency
            ? {
                name: agency.name,
                logo: agency.logo,
              }
            : null,
          invitedByUser: invitedByUser
            ? {
                name: invitedByUser.name,
                email: invitedByUser.email,
              }
            : null,
        };
      })
    );

    return invitationsWithAgency;
  },
});

// ==================== UTILITY FUNCTIONS ====================

// Helper function to get default permissions based on role
function getDefaultPermissions(role: string) {
  const permissions = {
    canCreateTrips: false,
    canEditTrips: false,
    canDeleteTrips: false,
    canManagePricing: false,
    canCreateBookings: false,
    canEditBookings: false,
    canCancelBookings: false,
    canProcessPayments: false,
    canManageMembers: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canExportData: false,
    canManageLocations: false,
    canManageItineraries: false,
  };

  switch (role) {
    case 'admin':
      return {
        ...permissions,
        canCreateTrips: true,
        canEditTrips: true,
        canDeleteTrips: true,
        canManagePricing: true,
        canCreateBookings: true,
        canEditBookings: true,
        canCancelBookings: true,
        canProcessPayments: true,
        canViewAnalytics: true,
        canExportData: true,
        canManageLocations: true,
        canManageItineraries: true,
      };
    case 'manager':
      return {
        ...permissions,
        canCreateTrips: true,
        canEditTrips: true,
        canManagePricing: true,
        canCreateBookings: true,
        canEditBookings: true,
        canCancelBookings: true,
        canViewAnalytics: true,
        canManageLocations: true,
        canManageItineraries: true,
      };
    case 'agent':
      return {
        ...permissions,
        canCreateBookings: true,
        canEditBookings: true,
        canViewAnalytics: true,
      };
    case 'editor':
      return {
        ...permissions,
        canEditTrips: true,
        canManageLocations: true,
        canManageItineraries: true,
      };
    case 'viewer':
      return {
        ...permissions,
        canViewAnalytics: true,
      };
    default:
      return permissions;
  }
}

// Check if user has permission for agency
export const checkPermission = query({
  args: {
    agencyId: v.id('agencies'),
    permission: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!membership || membership.status !== 'active') return false;

    return (membership.permissions as any)[args.permission] || false;
  },
});

// Get agency stats
export const getAgencyStats = query({
  args: { agencyId: v.id('agencies') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Authentication required');

    // Check permissions
    const membership = await ctx.db
      .query('members')
      .withIndex('by_agency_user', (q) =>
        q.eq('agencyId', args.agencyId).eq('userId', userId)
      )
      .first();

    if (!membership || !membership.permissions.canViewAnalytics) {
      throw new Error('Insufficient permissions');
    }

    const [members, trips, bookings, pendingInvitations] = await Promise.all([
      ctx.db
        .query('members')
        .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
        .filter((q) => q.eq(q.field('status'), 'active'))
        .collect(),
      ctx.db
        .query('trips')
        .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
        .collect(),
      ctx.db
        .query('bookings')
        .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
        .collect(),
      ctx.db
        .query('invitations')
        .withIndex('by_agency', (q) => q.eq('agencyId', args.agencyId))
        .filter((q) => q.eq(q.field('status'), 'pending'))
        .collect(),
    ]);

    const totalRevenue = bookings
      .filter((booking) => booking.paymentStatus === 'paid')
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    const activeTrips = trips.filter((trip) => trip.status === 'active').length;
    const confirmedBookings = bookings.filter(
      (booking) => booking.status === 'confirmed'
    ).length;

    return {
      totalMembers: members.length,
      totalTrips: trips.length,
      activeTrips,
      totalBookings: bookings.length,
      confirmedBookings,
      totalRevenue,
      pendingInvitations: pendingInvitations.length,
    };
  },
});
