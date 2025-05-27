'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { FileResponseType } from './lib/uploadFiles';

type Props = {
  file: FileResponseType;
  handleDeleteFile: any;
};

export const DeleteFileModal = ({ file, handleDeleteFile }: Props) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await handleDeleteFile();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          className='w-12 h-12 p-1 rounded-full absolute inset-0 m-auto flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        >
          <Trash2 className='h-5 w-5' />
          <span className='sr-only'>Remove</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Image</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this image?
          </DialogDescription>
        </DialogHeader>

        <Image
          alt='Product image'
          className='aspect-square h-full w-full rounded-md object-cover transition-opacity duration-300 group-hover:opacity-60'
          height={500}
          width={500}
          src={file.fileUrl}
        />

        <DialogFooter>
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
