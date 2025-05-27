'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
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
import { Globe, Mail, Phone, Hash } from 'lucide-react';
import { Doc } from '@/convex/_generated/dataModel';
import { useEffect } from 'react';

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
  agency?: Doc<'agencies'>;
}

export const AgencyForm = ({ agency }: Props) => {
  const router = useRouter();
  const createAgency = useMutation(api.agencies.createAgency);
  const updateAgency = useMutation(api.agencies.updateAgency);

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

  // Populate form with existing agency data when agency prop changes
  useEffect(() => {
    if (agency) {
      form.reset({
        name: agency.name || '',
        bio: agency.bio || '',
        website: agency.website || '',
        email: agency.email || '',
        phone: agency.phone || '',
        socialMedia: {
          facebook: agency.socialMedia?.facebook || '',
          instagram: agency.socialMedia?.instagram || '',
          twitter: agency.socialMedia?.twitter || '',
          linkedin: agency.socialMedia?.linkedin || '',
          youtube: agency.socialMedia?.youtube || '',
        },
        taxId: agency.taxId || '',
      });
    }
  }, [agency, form]);

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
        socialMedia: data.socialMedia
          ? {
              facebook: data.socialMedia.facebook || undefined,
              instagram: data.socialMedia.instagram || undefined,
              twitter: data.socialMedia.twitter || undefined,
              linkedin: data.socialMedia.linkedin || undefined,
              youtube: data.socialMedia.youtube || undefined,
            }
          : undefined,
      };

      if (agency) {
        await updateAgency({ agencyId: agency._id, ...cleanedData });
        toast.success('Agency updated successfully!');
      } else {
        const agencyId = await createAgency(cleanedData);
        toast.success('Agency created successfully!');
        router.push(`/agency/${agencyId}`);
      }

      // Only reset form if creating new agency, not when updating
      if (!agency) {
        form.reset();
      }
    } catch (error) {
      toast.error(
        agency
          ? 'Failed to update agency. Please try again.'
          : 'Failed to create agency. Please try again.'
      );
      console.error('Error creating/updating agency:', error);
    }
  };

  return (
    <div className='max-w-3xl'>
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
                      <Input placeholder='Enter your agency name' {...field} />
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
                      <Input placeholder='https://yourwebsite.com' {...field} />
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
              <CardTitle className='text-lg'>Social Media</CardTitle>
            </CardHeader>

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
          </Card>

          {/* Form Actions */}
          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? agency
                ? 'Updating...'
                : 'Creating...'
              : agency
                ? 'Update Agency'
                : 'Create Agency'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
