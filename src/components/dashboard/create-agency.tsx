'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2, Globe, Mail, Phone, MapPin, Hash } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';

// Zod schema matching your Convex mutation args
const createAgencySchema = z.object({
  name: z
    .string()
    .min(1, 'Agency name is required')
    .min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  socialMedia: z
    .object({
      facebook: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
      instagram: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
      twitter: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
      linkedin: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
      youtube: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
    })
    .optional(),
  taxId: z.string().optional(),
});

type CreateAgencyFormData = z.infer<typeof createAgencySchema>;

interface Props {
  trigger?: React.ReactNode;
  onSuccess?: (agencyId: Id<'agencies'>) => void;
}

export const CreateAgencyDialog = ({ trigger, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [showSocialMedia, setShowSocialMedia] = useState(false);

  const createAgency = useMutation(api.agencies.createAgency);

  const form = useForm<CreateAgencyFormData>({
    resolver: zodResolver(createAgencySchema),
    defaultValues: {
      name: '',
      bio: '',
      website: '',
      email: '',
      phone: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      },
      taxId: '',
    },
  });

  const onSubmit = async (data: CreateAgencyFormData) => {
    try {
      // Clean up empty optional fields
      const cleanedData = {
        ...data,
        bio: data.bio || undefined,
        website: data.website || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        taxId: data.taxId || undefined,
        socialMedia:
          showSocialMedia && data.socialMedia
            ? {
                facebook: data.socialMedia.facebook || undefined,
                instagram: data.socialMedia.instagram || undefined,
                twitter: data.socialMedia.twitter || undefined,
                linkedin: data.socialMedia.linkedin || undefined,
                youtube: data.socialMedia.youtube || undefined,
              }
            : undefined,
      };

      const agencyId = await createAgency(cleanedData);

      toast.success('Agency created successfully!');
      setOpen(false);
      form.reset();
      onSuccess?.(agencyId);
    } catch (error) {
      toast.error('Failed to create agency. Please try again.');
      console.error('Error creating agency:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant='outline'>Create Travel Agency</Button>}
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Building2 className='w-5 h-5' />
            Create New Agency
          </DialogTitle>
          <DialogDescription>
            Set up your travel agency profile with all the essential
            information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your agency name'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='bio'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Tell us about your agency...'
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of your agency and services
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Mail className='w-4 h-4' />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='website'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <Globe className='w-4 h-4' />
                        Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://yourwebsite.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='info@youragency.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <Phone className='w-4 h-4' />
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='+1 (555) 123-4567' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='taxId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <Hash className='w-4 h-4' />
                        Tax ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Tax identification number'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Social Media Section */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>Social Media</CardTitle>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setShowSocialMedia(!showSocialMedia)}
                  >
                    {showSocialMedia ? 'Hide' : 'Add'} Social Media
                  </Button>
                </div>
              </CardHeader>
              {showSocialMedia && (
                <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='socialMedia.facebook'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://facebook.com/youragency'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='socialMedia.instagram'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://instagram.com/youragency'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='socialMedia.twitter'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://twitter.com/youragency'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='socialMedia.linkedin'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://linkedin.com/company/youragency'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='socialMedia.youtube'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://youtube.com/@youragency'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              )}
            </Card>

            <Separator />

            {/* Form Actions */}
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                Fields marked with * are required
              </p>
              <div className='flex gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? 'Creating...'
                    : 'Create Agency'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
