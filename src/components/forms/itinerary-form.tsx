'use client';

import React, { useState } from 'react';
import { ItineraryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, Clock, MapPin, Image, Plus } from 'lucide-react';
import { MapboxMap } from '../maps/mapbox-map';
import { Label } from '../ui/label';

interface ItineraryFormProps {
  onAdd: (item: ItineraryItem) => void;
  onClose: () => void;
}

export function ItineraryForm({ onAdd, onClose }: ItineraryFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    images: [] as string[],
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });
  const [imageUrl, setImageUrl] = useState('');

  const handleMapClick = (latitude: number, longitude: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.startTime ||
      !formData.endTime
    ) {
      alert('Please fill in all required fields');
      return;
    }

    const item: ItineraryItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      images: formData.images,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    onAdd(item);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='w-5 h-5' />
            Add Itinerary Item
          </CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='w-4 h-4' />
          </Button>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Basic Information */}
            <div className='space-y-4'>
              <div>
                <Label className=' text-sm font-medium mb-2'>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder='Enter activity title'
                  required
                />
              </div>

              <div>
                <Label className=' text-sm font-medium mb-2'>
                  Description *
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder='Describe the activity...'
                  className='min-h-[100px]'
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-4'>
                <div>
                  <Label className=' text-sm font-medium mb-2 flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    Start Date *
                  </Label>
                  <Input
                    type='date'
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label className=' text-sm font-medium mb-2 flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    Start Time *
                  </Label>
                  <Input
                    type='time'
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <Label className=' text-sm font-medium mb-2 flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    End Date *
                  </Label>
                  <Input
                    type='date'
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label className=' text-sm font-medium mb-2 flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    End Time *
                  </Label>
                  <Input
                    type='time'
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className='space-y-4'>
              <Label className=' text-sm font-medium flex items-center gap-2'>
                <Image className='w-4 h-4' />
                Images
              </Label>

              <div className='flex gap-2'>
                <Input
                  placeholder='Enter image URL'
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button type='button' onClick={addImage}>
                  <Plus className='w-4 h-4' />
                </Button>
              </div>

              {formData.images.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {formData.images.map((url, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={url}
                        alt={`Activity image ${index + 1}`}
                        className='w-full h-24 object-cover rounded-lg'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1'
                        onClick={() => removeImage(index)}
                      >
                        <X className='w-3 h-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className='space-y-4'>
              <Label className=' text-sm font-medium flex items-center gap-2'>
                <MapPin className='w-4 h-4' />
                Location (Optional)
              </Label>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className=' text-sm font-medium mb-2'>Latitude</Label>
                  <Input
                    type='number'
                    step='any'
                    value={formData.latitude || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        latitude: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder='Enter latitude'
                  />
                </div>

                <div>
                  <Label className=' text-sm font-medium mb-2'>Longitude</Label>
                  <Input
                    type='number'
                    step='any'
                    value={formData.longitude || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        longitude: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder='Enter longitude'
                  />
                </div>
              </div>

              {/* Map */}
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>
                  Click on the map to set location
                </p>
                <MapboxMap
                  locations={
                    formData.latitude && formData.longitude
                      ? [
                          {
                            id: 'itinerary-location',
                            city: formData.title || 'Activity Location',
                            country: '',
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
            </div>

            <div className='flex justify-end gap-2 pt-4 border-t'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit'>Add to Itinerary</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
