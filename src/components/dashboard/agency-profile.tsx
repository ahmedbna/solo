'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { Doc } from '@/convex/_generated/dataModel';
import { Image } from '@/components/ui/image';
import { DeleteFileModal } from '@/components/s3/delete-file-modal';
import { UploadFilesModal } from '@/components/s3/upload-files-modal';
import { FileResponseType } from '@/components/s3/lib/uploadFiles';
import { deleteFile } from '@/components/s3/actions';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

interface Props {
  agency: Doc<'agencies'>;
}

export const AgencyProfile = ({ agency }: Props) => {
  const [open, setOpen] = useState(false);
  const updateAgency = useMutation(api.agencies.updateAgency);

  const onUploadLogoComplete = async (files: FileResponseType[]) => {
    if (!agency) return;

    if (files.length > 0) {
      await updateAgency({
        agencyId: agency._id,
        logo: files,
      });
    }
  };

  const handleDeleteFile = async (file: FileResponseType) => {
    if (!agency) return;

    await updateAgency({
      agencyId: agency._id,
      logo: undefined,
    });

    await deleteFile(file.fileName);
  };

  const socialMediaPlatforms = [
    {
      key: 'facebook',
      icon: Facebook,
      label: 'Facebook',
      color: 'text-blue-600',
    },
    {
      key: 'instagram',
      icon: Instagram,
      label: 'Instagram',
      color: 'text-pink-500',
    },
    { key: 'twitter', icon: Twitter, label: 'Twitter', color: 'text-blue-400' },
    {
      key: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'text-blue-700',
    },
    { key: 'youtube', icon: Youtube, label: 'YouTube', color: 'text-red-600' },
  ];

  const activeSocialMedia = socialMediaPlatforms.filter(
    (platform) => agency.socialMedia?.[platform.key as keyof SocialMedia]
  );

  const isAdmin = true;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 '>
      <div>
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center py-8 gap-6'>
          {/* Agency Info */}
          <div className='flex flex-row items-end gap-4'>
            {/* Logo */}
            <div>
              {agency.logo ? (
                <div className='relative group'>
                  <Image
                    src={agency.logo[0].fileUrl}
                    alt={'brand'}
                    width={400}
                    height={400}
                    className={`aspect-square w-32 h-32 rounded-xl object-cover ${isAdmin ? 'transition-opacity duration-300 group-hover:opacity-50' : ''}`}
                  />
                  {isAdmin ? (
                    <DeleteFileModal
                      file={agency.logo[0]}
                      handleDeleteFile={() => handleDeleteFile(agency.logo![0])}
                    />
                  ) : null}
                </div>
              ) : isAdmin ? (
                <UploadFilesModal
                  open={open}
                  multiple={false}
                  setOpen={setOpen}
                  onUploadComplete={onUploadLogoComplete}
                >
                  <Button
                    size='sm'
                    variant='outline'
                    className='w-32 h-32 rounded-xl aspect-square border border-dashed gap-2 text-wrap'
                  >
                    Upload logo
                  </Button>
                </UploadFilesModal>
              ) : (
                <Button
                  size='sm'
                  variant='outline'
                  className='w-32 h-32 rounded-xl aspect-square border border-dashed gap-2 text-wrap'
                >
                  No logo
                </Button>
              )}
            </div>

            {/* Agency Details */}
            <div className='space-y-2'>
              {agency.taxId && (
                <Badge variant='secondary' className='text-xs'>
                  Tax ID: {agency.taxId}
                </Badge>
              )}
              <h1 className='text-3xl sm:text-4xl font-bold'>{agency.name}</h1>
            </div>
          </div>

          {/* Action Button */}
          <div className='flex-shrink-0'>
            <Button size='lg' asChild className='shadow-md'>
              <Link href={`/agency/trips/new/${agency._id}`}>
                <Plus className='w-5 h-5 mr-2' />
                New Trip
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        {agency.bio && (
          <p className='text-muted-foreground max-w-2xl leading-relaxed'>
            {agency.bio}
          </p>
        )}

        <div className='flex items-center gap-2'>
          <div className='flex items-center flex-wrap gap-3'>
            {agency.website && (
              <div className='flex items-center gap-2'>
                <Globe className='w-4 h-4 text-muted-foreground' />
                <a
                  href={
                    agency.website.startsWith('http')
                      ? agency.website
                      : `https://${agency.website}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-muted-foreground hover:text-yellow-400 font-medium'
                >
                  {agency.website}
                </a>
              </div>
            )}

            {agency.phone && (
              <div className='flex items-center gap-2'>
                <Phone className='w-4 h-4 text-muted-foreground' />
                <a
                  href={`tel:${agency.phone}`}
                  className='text-muted-foreground hover:text-yellow-400 font-medium'
                >
                  {agency.phone}
                </a>
              </div>
            )}

            {agency.email && (
              <div className='flex items-center gap-2'>
                <Mail className='w-4 h-4 text-muted-foreground' />
                <a
                  href={`mailto:${agency.email}`}
                  className='text-muted-foreground hover:text-yellow-400 font-medium'
                >
                  {agency.email}
                </a>
              </div>
            )}
          </div>

          {activeSocialMedia.length > 0 && (
            <div className='flex items-center gap-3'>
              {activeSocialMedia.map((platform) => {
                const IconComponent = platform.icon;
                const url =
                  agency.socialMedia![platform.key as keyof SocialMedia];
                return (
                  <Button asChild key={platform.key} variant='ghost'>
                    <a
                      href={url!.startsWith('http') ? url! : `https://${url}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <IconComponent className={`w-6 h-6 ${platform.color}`} />
                    </a>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
