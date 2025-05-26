'use client';

import React, { useState } from 'react';
import { Location } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MapPin, Search } from 'lucide-react';
import { MapboxMap } from '../maps/mapbox-map';

interface LocationFormProps {
  onAdd: (location: Location) => void;
  onClose: () => void;
}

export function LocationForm({ onAdd, onClose }: LocationFormProps) {
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Simulate geocoding search (in real app, use Mapbox Geocoding API)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Mock search results - in real implementation, use Mapbox Geocoding API
    setTimeout(() => {
      const mockResults = {
        'New York': { lat: 40.7128, lng: -74.006, country: 'United States' },
        London: { lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
        Tokyo: { lat: 35.6762, lng: 139.6503, country: 'Japan' },
        Paris: { lat: 48.8566, lng: 2.3522, country: 'France' },
        Sydney: { lat: -33.8688, lng: 151.2093, country: 'Australia' },
      };

      const result = mockResults[searchQuery as keyof typeof mockResults];
      if (result) {
        setFormData({
          city: searchQuery,
          country: result.country,
          latitude: result.lat,
          longitude: result.lng,
        });
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleMapClick = (latitude: number, longitude: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.city || !formData.country) {
      alert('Please fill in city and country');
      return;
    }

    const location: Location = {
      id: Date.now().toString(),
      city: formData.city,
      country: formData.country,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    onAdd(location);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='w-5 h-5' />
            Add Location
          </CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='w-4 h-4' />
          </Button>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Search */}
          <div className='flex gap-2'>
            <Input
              placeholder='Search for a city (e.g., New York, London, Tokyo)'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button type='button' onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
              ) : (
                <Search className='w-4 h-4' />
              )}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>City</label>
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder='Enter city name'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Country
                </label>
                <Input
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  placeholder='Enter country name'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Latitude
                </label>
                <Input
                  type='number'
                  step='any'
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      latitude: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder='Enter latitude'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Longitude
                </label>
                <Input
                  type='number'
                  step='any'
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      longitude: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder='Enter longitude'
                />
              </div>
            </div>

            {/* Map */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium'>
                Location on Map
              </label>
              <p className='text-sm text-gray-500'>
                Click on the map to set coordinates
              </p>
              <MapboxMap
                locations={
                  formData.latitude && formData.longitude
                    ? [
                        {
                          id: 'preview',
                          city: formData.city || 'Selected Location',
                          country: formData.country,
                          latitude: formData.latitude,
                          longitude: formData.longitude,
                        },
                      ]
                    : []
                }
                height='300px'
                onClick={handleMapClick}
                interactive={true}
              />
            </div>

            <div className='flex justify-end gap-2 pt-4'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit'>Add Location</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
