import { z } from 'zod';

export const locationSchema = z.object({
  id: z.string(),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const itineraryItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  images: z.array(z.string()),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const tripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  images: z.array(z.string()),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  pricePerPerson: z.number().min(0, 'Price must be non-negative'),
  locations: z
    .array(locationSchema)
    .min(1, 'At least one location is required'),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  itinerary: z.array(itineraryItemSchema),
});
