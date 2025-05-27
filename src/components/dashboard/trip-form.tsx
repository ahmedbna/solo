'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import {
  Loader2,
  Plus,
  Trash2,
  X,
  MapPin,
  Clock,
  Tag,
  ChevronLeft,
  Eye,
  Save,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { FileResponseType } from '../s3/lib/uploadFiles';
import { deleteFile } from '../s3/actions';
import { Image } from '../ui/image';
import { DeleteFileModal } from '../s3/delete-file-modal';
import { UploadFiles } from '../s3/upload-files';

const tripFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  country: z.string().min(1, 'Country is required'),
  destinations: z
    .array(z.string().min(1))
    .min(1, 'At least one destination is required'),
  inclusions: z
    .array(z.string().min(1))
    .min(1, 'At least one inclusion is required'),
  exclusions: z.array(z.string().min(1)).optional(),
  basePrice: z.number().min(0, 'Base price must be positive'),
  type: z.enum(['domestic', 'international']),
});

type TripFormData = z.infer<typeof tripFormSchema>;

interface TripFormPageProps {
  trip?: Doc<'trips'>;
}

export const TripForm = ({ trip }: TripFormPageProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Convex mutations
  const createTrip = useMutation(api.trips.createTrip);
  const updateTrip = useMutation(api.trips.updateTrip);

  // Form setup
  const form = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: '',
      description: '',
      images: [],
      country: '',
      destinations: [],
      inclusions: [],
      exclusions: [],
      basePrice: 0,
      type: 'domestic',
    },
  });

  // Field arrays for dynamic fields
  const {
    fields: destinationFields,
    append: appendDestination,
    remove: removeDestination,
  } = useFieldArray({
    control: form.control,
    name: 'destinations',
  });

  const {
    fields: inclusionFields,
    append: appendInclusion,
    remove: removeInclusion,
  } = useFieldArray({
    control: form.control,
    name: 'inclusions',
  });

  const {
    fields: exclusionFields,
    append: appendExclusion,
    remove: removeExclusion,
  } = useFieldArray({
    control: form.control,
    name: 'exclusions',
  });

  // Load existing trip data when editing
  useEffect(() => {
    if (trip) {
      form.reset({
        title: trip.title,
        description: trip.description,
        country: trip.country,
        destinations: trip.destinations,
        inclusions: trip.inclusions,
        exclusions: trip.exclusions || [],
        basePrice: trip.basePrice,
        type: trip.type,
      });
    }
  }, [trip, form]);

  // Form submission
  const onSubmit = async (data: TripFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // if (trip) {
      //   await updateTrip({
      //     id: tripId,
      //     ...data,
      //   });
      // } else {
      //  await createTrip({
      //     agencyId,
      //     ...data,
      //   });
      // }
      // if (onSuccess) {
      //   onSuccess(resultTripId);
      // } else {
      //   router.push(`/agencies/${agencyId}/trips/${resultTripId}`);
      // }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group activities by day for display
  // const groupedActivities = itineraryFields.reduce(
  //   (acc, field, index) => {
  //     const day = form.watch(`itinerary.${index}.day`) || 1;
  //     if (!acc[day]) acc[day] = [];
  //     acc[day].push({ field, index });
  //     return acc;
  //   },
  //   {} as Record<number, Array<{ field: any; index: number }>>
  // );

  const onUploadComplete = async (files: FileResponseType[]) => {
    // const existingImages = product.images ? product.images : [];
    // if (files.length > 0) {
    //   await uploadProductImages({
    //     productId: product._id,
    //     images: [...existingImages, ...files],
    //   });
    // }
  };

  const handleDeleteFile = async (file: FileResponseType) => {
    // const newImages = product.images
    //   ? product.images?.filter((image) => image.fileName !== file.fileName)
    //   : [];
    // await uploadProductImages({
    //   productId: product._id,
    //   images: newImages,
    // });
    // await deleteFile(file.fileName);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full flex items-center max-w-5xl mx-auto p-4 md:p-8'
      >
        <div className='space-y-8'>
          {/* Header */}
          <div className='flex items-center gap-4'>
            <Button
              type='button'
              variant='outline'
              className='px-0 py-0 aspect-square'
              onClick={() => router.back()}
            >
              <ChevronLeft className='h-5 w-5' />
            </Button>
            <h1 className='flex-1 shrink-0 whitespace-nowrap text-2xl font-semibold tracking-tight sm:grow-0'>
              {trip ? `Edit ${trip?.title || 'Trip'}` : 'Create New Trip'}
            </h1>
            <Badge
              variant='outline'
              className='ml-auto sm:ml-0 text-muted-foreground'
            >
              {trip ? 'Editing' : 'Draft'}
            </Badge>
            <div className='hidden items-center gap-2 md:ml-auto md:flex'>
              {/* {trip && (
                <Button asChild size='sm' variant='outline'>
                  <Link href={`/agencies/${agencyId}/trips/${tripId}`}>
                    <div className='flex items-center gap-1'>
                      <Eye className='h-3.5 w-3.5' />
                      <span>View</span>
                    </div>
                  </Link>
                </Button>
              )} */}

              <Button type='submit' size='sm' disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className='h-3.5 w-3.5 animate-spin' />
                ) : (
                  <div className='flex items-center gap-1'>
                    <Save className='h-3.5 w-3.5' />
                    <span>{trip ? 'Update Trip' : 'Save Trip'}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {submitError && (
            <Alert variant='destructive'>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Main Content Grid */}
          <div className='grid gap-4 md:grid-cols-[1fr_300px] lg:gap-8'>
            {/* Left Column - Main Content */}
            <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the essential details about your trip
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Amazing Adventure in Paradise'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A compelling title that captures the essence of your
                          trip
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Describe what makes this trip special...'
                            className='min-h-[120px]'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description of the trip experience
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trip Images</CardTitle>
                  <CardDescription>
                    Add compelling images to showcase your trip
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-2'>
                    <div className='grid grid-cols-3 gap-2'>
                      {trip && trip.images
                        ? trip.images.map((image) => (
                            <div className='relative group ' key={image.name}>
                              <Image
                                alt='Trip image'
                                className='aspect-square h-full w-full rounded-md object-cover transition-opacity duration-300 group-hover:opacity-50'
                                height={84}
                                width={84}
                                src={image.fileUrl}
                              />
                              <DeleteFileModal
                                file={image}
                                handleDeleteFile={() => handleDeleteFile(image)}
                              />
                            </div>
                          ))
                        : null}

                      <UploadFiles
                        thumbnails={false}
                        onUploadComplete={onUploadComplete}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Trip Details</CardTitle>
                  <CardDescription>
                    Specify destinations, inclusions, and exclusions
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Inclusions */}
                  <div className='space-y-4'>
                    <FormLabel>What's Included</FormLabel>
                    {inclusionFields.map((field, index) => (
                      <div key={field.id} className='flex gap-2'>
                        <FormField
                          control={form.control}
                          name={`inclusions.${index}`}
                          render={({ field }) => (
                            <FormItem className='flex-1'>
                              <FormControl>
                                <Input
                                  placeholder='e.g., Accommodation, Meals, Transportation'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => removeInclusion(index)}
                          disabled={inclusionFields.length === 1}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => appendInclusion('')}
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Inclusion
                    </Button>
                  </div>

                  <Separator />

                  {/* Exclusions */}
                  <div className='space-y-4'>
                    <FormLabel>What's Not Included</FormLabel>
                    {exclusionFields.map((field, index) => (
                      <div key={field.id} className='flex gap-2'>
                        <FormField
                          control={form.control}
                          name={`exclusions.${index}`}
                          render={({ field }) => (
                            <FormItem className='flex-1'>
                              <FormControl>
                                <Input
                                  placeholder='e.g., Personal expenses, Travel insurance'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => removeExclusion(index)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => appendExclusion('')}
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Exclusion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Destinations</CardTitle>
                  <CardDescription>
                    Set the base price for this trip
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select trip type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='domestic'>Domestic</SelectItem>
                            <SelectItem value='international'>
                              International
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g., US, France, Japan'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-4'>
                    <FormLabel>Destinations</FormLabel>
                    {destinationFields.map((field, index) => (
                      <div key={field.id} className='flex gap-2'>
                        <FormField
                          control={form.control}
                          name={`destinations.${index}`}
                          render={({ field }) => (
                            <FormItem className='flex-1'>
                              <FormControl>
                                <Input
                                  placeholder='e.g., Paris, Tokyo, New York'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => removeDestination(index)}
                          disabled={destinationFields.length === 1}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => appendDestination('')}
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Destination
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>
                    Set the base price for this trip
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='basePrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price (USD)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='0.00'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Starting price per person
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Save Button */}
          <div className='md:hidden'>
            <Button
              type='submit'
              size='lg'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className='h-4 w-4 animate-spin mr-2' />
              ) : (
                <Save className='h-4 w-4 mr-2' />
              )}
              {trip ? 'Update Trip' : 'Save Trip'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
