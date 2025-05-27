'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileResponseType } from './lib/uploadFiles';
import { UploadFiles } from './upload-files';
import { Accept } from 'react-dropzone';

type Props = {
  open: boolean;
  accept?: Accept;
  multiple?: boolean;
  setOpen: (open: boolean) => void;
  onUploadComplete: (uploaded: FileResponseType[]) => Promise<void>;
  children?: React.ReactNode;
};

export const UploadFilesModal = ({
  open,
  accept,
  multiple,
  setOpen,
  onUploadComplete,
  children,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload</DialogTitle>
          <DialogDescription>
            Click or drag and drop to upload
          </DialogDescription>
        </DialogHeader>
        <UploadFiles
          accept={accept}
          multiple={multiple}
          onUploadComplete={onUploadComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
