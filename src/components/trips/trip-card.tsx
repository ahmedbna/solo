'use client';

import { useState } from 'react';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface Trip {
  id: number;
  title: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
}

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className='group cursor-pointer py-0 rounded-3xl'>
      <CardContent className='p-4'>
        <div className='relative overflow-hidden rounded-xl mb-4'>
          <img
            src={trip.image}
            alt={trip.title}
            className='w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105'
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className='absolute top-3 right-3 p-2 rounded-full bg-muted-foreground/80 hover:bg-muted-foreground transition-colors'
          >
            <Heart
              className={`h-5 w-5 ${
                isLiked ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
          <div className='absolute bottom-3 left-3 bg-muted/90 backdrop-blur-sm px-3 py-1 rounded-full'>
            <span className='text-sm font-semibold'>${trip.price}</span>
            <span className='text-sm'> per person</span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>{trip.title}</h3>
            <div className='flex items-center space-x-1'>
              <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
              <span className='text-sm font-medium text-muted-foreground'>
                {trip.rating}
              </span>
              <span className='text-sm text-muted-foreground'>
                ({trip.reviews})
              </span>
            </div>
          </div>

          <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
            <div className='flex items-center space-x-1'>
              <MapPin className='h-4 w-4' />
              <span>{trip.location}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <Clock className='h-4 w-4' />
              <span>{trip.duration}</span>
            </div>
          </div>

          <p className=' text-sm line-clamp-2 text-muted-foreground'>
            {trip.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
