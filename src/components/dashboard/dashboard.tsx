'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Send,
  BarChart3,
  Clock,
  Star,
  Plane,
} from 'lucide-react';
import { AgencyForm } from '@/components/forms/agency-form';
import { Doc } from '@/convex/_generated/dataModel';
import { AgencyProfile } from './agency-profile';

type Props = {
  agency: Doc<'agencies'>;
};

export const Dashboard = ({ agency }: Props) => {
  const [activeTab, setActiveTab] = useState('trips');

  const mockStats = {
    totalMembers: 8,
    totalTrips: 24,
    activeTrips: 12,
    totalBookings: 156,
    confirmedBookings: 142,
    totalRevenue: 285640,
    pendingInvitations: 2,
  };

  const mockMembers = [
    {
      _id: '1',
      role: 'owner',
      status: 'active',
      joinedAt: Date.now() - 86400000 * 30,
      user: {
        name: 'John Doe',
        email: 'john@adventuretravels.com',
        image: null,
      },
    },
    {
      _id: '2',
      role: 'admin',
      status: 'active',
      joinedAt: Date.now() - 86400000 * 15,
      user: {
        name: 'Sarah Smith',
        email: 'sarah@adventuretravels.com',
        image: null,
      },
    },
    {
      _id: '3',
      role: 'agent',
      status: 'active',
      joinedAt: Date.now() - 86400000 * 7,
      user: {
        name: 'Mike Johnson',
        email: 'mike@adventuretravels.com',
        image: null,
      },
    },
  ];

  const mockTrips = [
    {
      _id: '1',
      title: 'Himalayan Adventure Trek',
      description: 'Experience the majestic Himalayas with our expert guides',
      country: 'Nepal',
      destinations: ['Kathmandu', 'Everest Base Camp', 'Namche Bazaar'],
      basePrice: 2500,
      type: 'international',
      status: 'active',
      images: [],
    },
    {
      _id: '2',
      title: 'Costa Rica Wildlife Safari',
      description:
        "Discover incredible wildlife in Costa Rica's national parks",
      country: 'Costa Rica',
      destinations: ['San José', 'Manuel Antonio', 'Monteverde'],
      basePrice: 1800,
      type: 'international',
      status: 'active',
      images: [],
    },
  ];

  const mockBookings = [
    {
      _id: '1',
      bookingReference: 'AT001',
      customer: {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@email.com',
        phone: '+1-555-0456',
      },
      totalAmount: 2500,
      paidAmount: 2500,
      paymentStatus: 'paid',
      status: 'confirmed',
    },
    {
      _id: '2',
      bookingReference: 'AT002',
      customer: {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@email.com',
        phone: '+1-555-0789',
      },
      totalAmount: 1800,
      paidAmount: 900,
      paymentStatus: 'partial',
      status: 'pending',
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'agent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'editor':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
      case 'canceled':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='min-h-screen '>
      <AgencyProfile agency={agency} />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-6 lg:w-fit'>
            <TabsTrigger value='trips' className='flex items-center space-x-2'>
              <MapPin className='w-4 h-4' />
              <span className='hidden sm:inline'>Trips</span>
            </TabsTrigger>

            <TabsTrigger value='waves' className='flex items-center space-x-2'>
              <Plane className='w-4 h-4' />
              <span className='hidden sm:inline'>Waves</span>
            </TabsTrigger>

            <TabsTrigger
              value='bookings'
              className='flex items-center space-x-2'
            >
              <Calendar className='w-4 h-4' />
              <span className='hidden sm:inline'>Bookings</span>
            </TabsTrigger>

            <TabsTrigger value='agency' className='flex items-center space-x-2'>
              <Building2 className='w-4 h-4' />
              <span className='hidden sm:inline'>Agency</span>
            </TabsTrigger>

            <TabsTrigger
              value='members'
              className='flex items-center space-x-2'
            >
              <Users className='w-4 h-4' />
              <span className='hidden sm:inline'>Team</span>
            </TabsTrigger>

            <TabsTrigger
              value='analytics'
              className='flex items-center space-x-2'
            >
              <BarChart3 className='w-4 h-4' />
              <span className='hidden sm:inline'>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Trips Tab */}
          <TabsContent value='trips' className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold '>Trip Management</h2>
                <p className='text-muted-foreground'>
                  Manage your travel packages and itineraries
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {mockTrips.map((trip) => (
                <Card
                  key={trip._id}
                  className='hover:shadow-lg transition-shadow'
                >
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-lg'>{trip.title}</CardTitle>
                      <Badge className={getStatusBadgeColor(trip.status)}>
                        {trip.status}
                      </Badge>
                    </div>
                    <CardDescription className='line-clamp-2'>
                      {trip.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <MapPin className='w-4 h-4 mr-2' />
                        {trip.destinations.join(', ')}
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-2xl font-bold '>
                          {formatCurrency(trip.basePrice)}
                        </span>
                        <Badge variant='outline' className='capitalize'>
                          {trip.type}
                        </Badge>
                      </div>
                      <div className='flex space-x-2'>
                        <Button size='sm' variant='outline' className='flex-1'>
                          <Eye className='w-4 h-4 mr-1' />
                          View
                        </Button>
                        <Button size='sm' variant='outline' className='flex-1'>
                          <Edit className='w-4 h-4 mr-1' />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value='bookings' className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold '>Booking Management</h2>
                <p className='text-muted-foreground'>
                  Track and manage customer bookings
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b'>
                        <th className='text-left py-3 px-4'>Reference</th>
                        <th className='text-left py-3 px-4'>Customer</th>
                        <th className='text-left py-3 px-4'>Amount</th>
                        <th className='text-left py-3 px-4'>Payment</th>
                        <th className='text-left py-3 px-4'>Status</th>
                        <th className='text-left py-3 px-4'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBookings.map((booking) => (
                        <tr key={booking._id} className='border-b hover:'>
                          <td className='py-3 px-4 font-mono text-sm'>
                            #{booking.bookingReference}
                          </td>
                          <td className='py-3 px-4'>
                            <div>
                              <p className='font-medium'>
                                {booking.customer.firstName}{' '}
                                {booking.customer.lastName}
                              </p>
                              <p className='text-sm text-gray-500'>
                                {booking.customer.email}
                              </p>
                            </div>
                          </td>
                          <td className='py-3 px-4'>
                            <div>
                              <p className='font-medium'>
                                {formatCurrency(booking.totalAmount)}
                              </p>
                              <p className='text-sm text-gray-500'>
                                Paid: {formatCurrency(booking.paidAmount)}
                              </p>
                            </div>
                          </td>
                          <td className='py-3 px-4'>
                            <Badge
                              className={getStatusBadgeColor(
                                booking.paymentStatus
                              )}
                            >
                              {booking.paymentStatus}
                            </Badge>
                          </td>
                          <td className='py-3 px-4'>
                            <Badge
                              className={getStatusBadgeColor(booking.status)}
                            >
                              {booking.status}
                            </Badge>
                          </td>
                          <td className='py-3 px-4'>
                            <div className='flex space-x-2'>
                              <Button size='sm' variant='outline'>
                                <Eye className='w-4 h-4' />
                              </Button>
                              <Button size='sm' variant='outline'>
                                <Edit className='w-4 h-4' />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agency Tab */}
          <TabsContent value='agency' className='space-y-6'>
            <AgencyForm agency={agency} />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value='members' className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold '>Team Management</h2>
                <p className='text-muted-foreground'>
                  Manage agency members and permissions
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className='w-4 h-4 mr-2' />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your agency team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='inviteEmail'>Email Address</Label>
                      <Input
                        id='inviteEmail'
                        type='email'
                        placeholder='Enter email address'
                      />
                    </div>
                    <div>
                      <Label htmlFor='inviteRole'>Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='admin'>Admin</SelectItem>
                          <SelectItem value='manager'>Manager</SelectItem>
                          <SelectItem value='agent'>Agent</SelectItem>
                          <SelectItem value='editor'>Editor</SelectItem>
                          <SelectItem value='viewer'>Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='flex justify-end space-x-2'>
                      <Button variant='outline'>Cancel</Button>
                      <Button>
                        <Send className='w-4 h-4 mr-2' />
                        Send Invitation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {mockMembers.map((member) => (
                    <div
                      key={member._id}
                      className='flex items-center justify-between p-4 border rounded-lg hover:'
                    >
                      <div className='flex items-center space-x-4'>
                        <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium'>
                          {member.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className='font-medium '>{member.user.name}</p>
                          <p className='text-sm text-gray-500'>
                            {member.user.email}
                          </p>
                          <p className='text-xs text-gray-400'>
                            Joined {formatDate(member.joinedAt)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {member.role}
                        </Badge>
                        <Badge className={getStatusBadgeColor(member.status)}>
                          {member.status}
                        </Badge>
                        {member.role !== 'owner' && (
                          <div className='flex space-x-1'>
                            <Button size='sm' variant='outline'>
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button size='sm' variant='outline'>
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value='analytics' className='space-y-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card className='hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-muted-foreground'>
                    Total Revenue
                  </CardTitle>
                  <DollarSign className='h-5 w-5 text-green-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold '>
                    {formatCurrency(mockStats.totalRevenue)}
                  </div>
                  <p className='text-xs text-green-600 flex items-center mt-1'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className='hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-muted-foreground'>
                    Active Trips
                  </CardTitle>
                  <MapPin className='h-5 w-5 text-blue-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold '>
                    {mockStats.activeTrips}
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    {mockStats.totalTrips} total trips
                  </p>
                </CardContent>
              </Card>

              <Card className='hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-muted-foreground'>
                    Bookings
                  </CardTitle>
                  <Calendar className='h-5 w-5 text-purple-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold '>
                    {mockStats.confirmedBookings}
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    {mockStats.totalBookings} total bookings
                  </p>
                </CardContent>
              </Card>

              <Card className='hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-muted-foreground'>
                    Team Members
                  </CardTitle>
                  <Users className='h-5 w-5 text-orange-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold '>
                    {mockStats.totalMembers}
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    {mockStats.pendingInvitations} pending invites
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2'>
                    <Clock className='w-5 h-5' />
                    <span>Recent Bookings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {mockBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking._id}
                        className='flex items-center justify-between p-3  rounded-lg'
                      >
                        <div>
                          <p className='font-medium '>
                            {booking.customer.firstName}{' '}
                            {booking.customer.lastName}
                          </p>
                          <p className='text-sm text-gray-500'>
                            #{booking.bookingReference}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium '>
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <Badge
                            className={getStatusBadgeColor(
                              booking.paymentStatus
                            )}
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2'>
                    <Star className='w-5 h-5' />
                    <span>Popular Trips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {mockTrips.slice(0, 3).map((trip) => (
                      <div
                        key={trip._id}
                        className='flex items-center justify-between p-3  rounded-lg'
                      >
                        <div className='flex-1'>
                          <p className='font-medium '>{trip.title}</p>
                          <p className='text-sm text-gray-500'>
                            {trip.destinations.join(', ')}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium '>
                            {formatCurrency(trip.basePrice)}
                          </p>
                          <Badge className={getStatusBadgeColor(trip.status)}>
                            {trip.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
