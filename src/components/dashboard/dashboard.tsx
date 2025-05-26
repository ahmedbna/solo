'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Users, DollarSign, Plus } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Travel Agency Dashboard
            </h1>
            <Link href='/trips/new'>
              <Button className='flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Create New Trip
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Trips</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>24</div>
              <p className='text-xs text-muted-foreground'>
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Bookings
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>156</div>
              <p className='text-xs text-muted-foreground'>
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Destinations
              </CardTitle>
              <MapPin className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>18</div>
              <p className='text-xs text-muted-foreground'>
                Across 12 countries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Revenue</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>$45,231</div>
              <p className='text-xs text-muted-foreground'>
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  {
                    title: 'European Adventure',
                    dates: 'Jun 15 - Jun 25',
                    bookings: 12,
                  },
                  {
                    title: 'Asian Cultural Tour',
                    dates: 'Jul 2 - Jul 12',
                    bookings: 8,
                  },
                  {
                    title: 'Safari Experience',
                    dates: 'Aug 10 - Aug 20',
                    bookings: 6,
                  },
                ].map((trip, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div>
                      <h4 className='font-medium'>{trip.title}</h4>
                      <p className='text-sm text-gray-500'>{trip.dates}</p>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium'>
                        {trip.bookings} bookings
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-3'>
                <Link href='/trips/new'>
                  <Button className='w-full justify-start' variant='outline'>
                    <Plus className='w-4 h-4 mr-2' />
                    Create New Trip
                  </Button>
                </Link>
                <Link href='/trips'>
                  <Button className='w-full justify-start' variant='outline'>
                    <Calendar className='w-4 h-4 mr-2' />
                    Manage Trips
                  </Button>
                </Link>
                <Button className='w-full justify-start' variant='outline'>
                  <Users className='w-4 h-4 mr-2' />
                  View Bookings
                </Button>
                <Button className='w-full justify-start' variant='outline'>
                  <MapPin className='w-4 h-4 mr-2' />
                  Explore Destinations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
