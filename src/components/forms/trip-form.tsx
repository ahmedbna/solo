'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { tripSchema } from '@/lib/validations';
import { Trip, Location, ItineraryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { LocationForm } from './location-form';
import { ItineraryForm } from './itinerary-form';
import {
  Plus,
  X,
  Save,
  MapPin,
  Calendar,
  Users,
  DollarSign,
} from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { MapboxMap } from '../maps/mapbox-map';

interface TripFormProps {
  trip?: Trip;
  onSubmit?: (data: Trip) => void;
  isEditing?: boolean;
}

export function TripForm({ trip, onSubmit, isEditing = false }: TripFormProps) {
  const [currentInclusion, setCurrentInclusion] = useState('');
  const [currentExclusion, setCurrentExclusion] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);

  const createTrip = useMutation(api.trips.createTrip);
  const updateTrip = useMutation(api.trips.updateTrip);

  const form = useForm<Trip>({
    resolver: zodResolver(tripSchema),
    defaultValues: trip || {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      images: [],
      capacity: 1,
      pricePerPerson: 0,
      locations: [],
      inclusions: [],
      exclusions: [],
      itinerary: [],
    },
  });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control: form.control,
    name: 'locations',
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control: form.control,
    name: 'itinerary',
  });

  const watchedLocations = form.watch('locations');
  const watchedImages = form.watch('images');
  const watchedInclusions = form.watch('inclusions');
  const watchedExclusions = form.watch('exclusions');

  const handleSubmit = async (data: Trip) => {
    try {
      if (isEditing && trip?._id) {
        await updateTrip({ id: trip._id, ...data });
      } else {
        await createTrip(data);
      }
      onSubmit?.(data);
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      const currentImages = form.getValues('images');
      form.setValue('images', [...currentImages, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    form.setValue(
      'images',
      currentImages.filter((_, i) => i !== index)
    );
  };

  const addInclusion = () => {
    if (currentInclusion.trim()) {
      const currentInclusions = form.getValues('inclusions');
      form.setValue('inclusions', [
        ...currentInclusions,
        currentInclusion.trim(),
      ]);
      setCurrentInclusion('');
    }
  };

  const removeInclusion = (index: number) => {
    const currentInclusions = form.getValues('inclusions');
    form.setValue(
      'inclusions',
      currentInclusions.filter((_, i) => i !== index)
    );
  };

  const addExclusion = () => {
    if (currentExclusion.trim()) {
      const currentExclusions = form.getValues('exclusions');
      form.setValue('exclusions', [
        ...currentExclusions,
        currentExclusion.trim(),
      ]);
      setCurrentExclusion('');
    }
  };

  const removeExclusion = (index: number) => {
    const currentExclusions = form.getValues('exclusions');
    form.setValue(
      'exclusions',
      currentExclusions.filter((_, i) => i !== index)
    );
  };

  const handleLocationAdd = (location: Location) => {
    appendLocation(location);
    setShowLocationForm(false);
  };

  const handleItineraryAdd = (item: ItineraryItem) => {
    appendItinerary(item);
    setShowItineraryForm(false);
  };

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>
          {isEditing ? 'Edit Trip' : 'Create New Trip'}
        </h1>
        <Button
          type='submit'
          form='trip-form'
          className='flex items-center gap-2'
        >
          <Save className='w-4 h-4' />
          {isEditing ? 'Update Trip' : 'Create Trip'}
        </Button>
      </div>

      <Form {...form}>
        <form
          id='trip-form'
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-8'
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter trip title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-2'>
                  <FormField
                    control={form.control}
                    name='startDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type='date' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='endDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type='date' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe your trip...'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='capacity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <Users className='w-4 h-4' />
                        Capacity
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='1'
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='pricePerPerson'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <DollarSign className='w-4 h-4' />
                        Price per Person ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='0'
                          step='0.01'
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex gap-2 mb-4'>
                <Input
                  placeholder='Enter image URL'
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button type='button' onClick={addImage}>
                  <Plus className='w-4 h-4' />
                </Button>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {watchedImages.map((url, index) => (
                  <div key={index} className='relative group'>
                    <img
                      src={url}
                      alt={`Trip image ${index + 1}`}
                      className='w-full h-32 object-cover rounded-lg'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                      onClick={() => removeImage(index)}
                    >
                      <X className='w-3 h-3' />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Locations */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span className='flex items-center gap-2'>
                  <MapPin className='w-5 h-5' />
                  Locations
                </span>
                <Button type='button' onClick={() => setShowLocationForm(true)}>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Location
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {locationFields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex items-center justify-between p-4 border rounded-lg'
                  >
                    <div>
                      <h4 className='font-medium'>
                        {field.city}, {field.country}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        {field.latitude.toFixed(4)},{' '}
                        {field.longitude.toFixed(4)}
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      onClick={() => removeLocation(index)}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </div>

              {watchedLocations.length > 0 && (
                <div className='mt-6'>
                  <MapboxMap locations={watchedLocations} height='300px' />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inclusions & Exclusions */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Inclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex gap-2 mb-4'>
                  <Input
                    placeholder='Add inclusion'
                    value={currentInclusion}
                    onChange={(e) => setCurrentInclusion(e.target.value)}
                  />
                  <Button type='button' onClick={addInclusion}>
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {watchedInclusions.map((item, index) => (
                    <Badge
                      key={index}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {item}
                      <X
                        className='w-3 h-3 cursor-pointer'
                        onClick={() => removeInclusion(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex gap-2 mb-4'>
                  <Input
                    placeholder='Add exclusion'
                    value={currentExclusion}
                    onChange={(e) => setCurrentExclusion(e.target.value)}
                  />
                  <Button type='button' onClick={addExclusion}>
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {watchedExclusions.map((item, index) => (
                    <Badge
                      key={index}
                      variant='destructive'
                      className='flex items-center gap-1'
                    >
                      {item}
                      <X
                        className='w-3 h-3 cursor-pointer'
                        onClick={() => removeExclusion(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Detailed Itinerary
                <Button
                  type='button'
                  onClick={() => setShowItineraryForm(true)}
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Itinerary Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {itineraryFields.map((field, index) => (
                  <div key={field.id} className='border rounded-lg p-4'>
                    <div className='flex items-start justify-between mb-2'>
                      <div>
                        <h4 className='font-medium'>{field.title}</h4>
                        <p className='text-sm text-gray-600 mt-1'>
                          {field.description}
                        </p>
                      </div>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => removeItinerary(index)}
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500 mb-3'>
                      <span>Start: {field.startDate}</span>
                      <span>End: {field.endDate}</span>
                      <span>From: {field.startTime}</span>
                      <span>To: {field.endTime}</span>
                    </div>

                    {field.images.length > 0 && (
                      <div className='grid grid-cols-4 gap-2 mb-3'>
                        {field.images.slice(0, 4).map((url, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={url}
                            alt={`${field.title} ${imgIndex + 1}`}
                            className='w-full h-16 object-cover rounded'
                          />
                        ))}
                      </div>
                    )}

                    {field.latitude && field.longitude && (
                      <div className='mt-3'>
                        <MapboxMap
                          locations={[
                            {
                              id: field.id,
                              city: field.title,
                              country: '',
                              latitude: field.latitude,
                              longitude: field.longitude,
                            },
                          ]}
                          height='200px'
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Location Form Dialog */}
      {showLocationForm && (
        <LocationForm
          onAdd={handleLocationAdd}
          onClose={() => setShowLocationForm(false)}
        />
      )}

      {/* Itinerary Form Dialog */}
      {showItineraryForm && (
        <ItineraryForm
          onAdd={handleItineraryAdd}
          onClose={() => setShowItineraryForm(false)}
        />
      )}
    </div>
  );
}
