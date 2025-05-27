'use client';

import { toast } from 'sonner';
import { Accept } from 'react-dropzone';
import { UploadDropzone } from './lib/upload-dropzone';
import { FileResponseType } from './lib/uploadFiles';
import { imageTypes } from './lib/fileTypes';

type Props = {
  accept?: Accept;
  className?: string;
  multiple?: boolean;
  thumbnails?: boolean;
  onUploadComplete: (uploaded: FileResponseType[]) => Promise<void>;
};

export const UploadFiles = ({
  accept = imageTypes,
  multiple = true,
  thumbnails,
  className,
  onUploadComplete,
}: Props) => {
  return (
    <UploadDropzone
      thumbnails={thumbnails}
      accept={accept}
      multiple={multiple}
      className={className}
      onUploadComplete={onUploadComplete}
      onUploadError={(error: any) => {
        toast.error(error);
      }}
    />
  );
};
