'use client';

import { Hero } from '@/components/layout/hero';
import { TripCard } from '@/components/trips/trip-card';

const featuredTrips = [
  {
    id: 1,
    title: 'Magical Iceland Adventure',
    location: 'Reykjavik, Iceland',
    duration: '7 days',
    price: 1299,
    rating: 4.9,
    reviews: 127,
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    description:
      'Explore the land of fire and ice with stunning waterfalls, geysers, and northern lights',
  },
  {
    id: 2,
    title: 'Tropical Paradise in Bali',
    location: 'Ubud, Bali',
    duration: '10 days',
    price: 899,
    rating: 4.8,
    reviews: 203,
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop',
    description:
      'Immerse yourself in Balinese culture with temples, rice terraces, and pristine beaches',
  },
  {
    id: 3,
    title: 'Swiss Alps Hiking Experience',
    location: 'Interlaken, Switzerland',
    duration: '5 days',
    price: 1599,
    rating: 4.9,
    reviews: 89,
    image:
      'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&h=600&fit=crop',
    description:
      'Trek through breathtaking alpine landscapes and charming mountain villages',
  },
  {
    id: 4,
    title: 'Japanese Cultural Journey',
    location: 'Kyoto, Japan',
    duration: '12 days',
    price: 2199,
    rating: 4.9,
    reviews: 156,
    image:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
    description:
      'Discover ancient temples, traditional gardens, and authentic Japanese hospitality',
  },
  {
    id: 5,
    title: 'African Safari Adventure',
    location: 'Serengeti, Tanzania',
    duration: '8 days',
    price: 3299,
    rating: 4.9,
    reviews: 78,
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop',
    description:
      "Witness the great migration and encounter Africa's Big Five in their natural habitat",
  },
  {
    id: 6,
    title: 'Norwegian Fjords Cruise',
    location: 'Bergen, Norway',
    duration: '6 days',
    price: 1799,
    rating: 4.8,
    reviews: 112,
    image:
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
    description:
      'Sail through dramatic fjords and experience the midnight sun in the Arctic Circle',
  },
];

export const HomePage = () => {
  return (
    <section className='min-h-screen py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Hero />
        {/* 
        <div className='text-center mb-12'>
          <h2 className='text-3xl lg:text-4xl font-bold mb-4'>
            Featured Destinations
          </h2>
          <p className='text-xl max-w-2xl mx-auto'>
            Handpicked adventures that will create memories to last a lifetime
          </p>
        </div> */}

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {featuredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  );
};
