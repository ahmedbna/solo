'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { twMerge } from 'tailwind-merge';
import { Spinner } from '@/components/ui/spinner';
import { Trash2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useUploadFiles } from './useUploadFiles';
import { FileResponseType } from './uploadFiles';
import type { Accept, FileWithPath } from 'react-dropzone';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';

type UploadDropzoneState = {
  progress: number | null;
  isDragActive: boolean;
};

type Props = {
  /// Required props

  // Either the absolute upload URL or an async function that generates it
  // uploadUrl: string | (() => Promise<string>);

  /// Optional functionality props

  // An object of with a common [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) as keys and an array of file extensions as values (similar to [showOpenFilePicker](https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker)'s types accept option)
  accept?: Accept;
  // Whether the user can select multiple files to upload. Defaults to `false`
  multiple?: boolean;
  // Whether the upload should start right after the user drags the file in. Defaults to `false`
  uploadImmediately?: boolean;

  /// Optional life-cycle props

  // Called every time the combined upload progresses by at least 10 percent. `progress` % is a multiple of 10.
  onUploadProgress?: (progress: number) => void;
  // Called at the start of each upload.
  onUploadBegin?: (fileName: string) => void;
  // Called when all the files have been uploaded.
  onUploadComplete?: (uploaded: FileResponseType[]) => Promise<void> | void;
  // Called if there was an error at any point in the upload process.
  onUploadError?: (error: unknown) => void;

  /// Optional appearance props

  // Text, if provided, is shown below the "Choose files" line
  title?: string;
  // Replaces all of the content shown in the dropzone. `progress` % is a multiple of 10 if the upload is in progress or `null`.
  content?: (state: UploadDropzoneState) => string;
  // Replaces the `className` of the dropzone. `progress` % is a multiple of 10 if the upload is in progress or `null`.
  classState?: (state: UploadDropzoneState) => string;
  className?: string;

  thumbnails?: boolean;
};

export function UploadDropzone({
  accept,
  multiple = true,
  uploadImmediately,
  onUploadProgress,
  onUploadBegin,
  onUploadComplete,
  onUploadError,
  title,
  content,
  classState,
  thumbnails = true,
  className,
}: Props) {
  const userId = useQuery(api.users.getId);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading } = useUploadFiles({
    userId,
    accept,
    onUploadComplete: async (res) => {
      setFiles([]);
      await onUploadComplete?.(res);
      setUploadProgress(0);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
      onUploadProgress?.(p);
    },
    onUploadError: onUploadError,
    onUploadBegin: onUploadBegin,
  });

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (multiple) {
        setFiles(acceptedFiles);
      } else {
        setFiles(acceptedFiles.slice(0, 1));
      }

      if (uploadImmediately === true) {
        void startUpload(acceptedFiles.slice(0, multiple ? undefined : 1));
        return;
      }
    },
    [multiple, uploadImmediately, startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    disabled: false,
    multiple: multiple,
  });

  const onUploadClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (files.length === 0) {
      return;
    }

    void startUpload(files);
  };

  const combinedState = {
    isDragActive,
    progress: isUploading ? uploadProgress : null,
  };

  const handleRemoveImage = (image: File) => {
    const newFiles = files.filter((file) => image.name !== file.name);
    setFiles(newFiles);
  };

  return (
    <div
      className={
        classState?.(combinedState) ??
        cn(
          'p-4 cursor-pointer flex flex-col aspect-square w-full h-full items-center justify-center rounded-md border border-dashed gap-2',
          isDragActive && 'bg-gray-600/10',
          className
        )
      }
      {...getRootProps()}
    >
      {files.length < 1 ? (
        <Upload className='h-5 w-5 text-muted-foreground' />
      ) : null}

      <label
        htmlFor='file-upload'
        className={twMerge(
          'text-muted-foreground text-center flex cursor-pointer items-center justify-center text-sm rounded-md'
        )}
      >
        {files.length > 0
          ? null
          : isDragActive
            ? 'Drop the files here'
            : title
              ? title
              : `Choose file${multiple ? 's' : ''} or drag & drop`}

        <input className='sr-only' {...getInputProps()} />

        {thumbnails ? (
          files.length ? (
            <div className='flex flex-wrap gap-2 max-h-[380px] overflow-y-auto w-full items-center justify-center rounded-md'>
              {files.map((image) => (
                <div className='relative group rounded-md' key={image.name}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${image.name}`}
                    className='aspect-square w-32 rounded-md object-cover transition-opacity duration-300 group-hover:opacity-50'
                    onLoad={() =>
                      URL.revokeObjectURL(URL.createObjectURL(image))
                    }
                  />
                  <Button
                    type='button'
                    className='w-12 h-12 p-1 rounded-full absolute inset-0 m-auto flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(image);
                    }}
                  >
                    <Trash2 className='h-5 w-5' />
                    <span className='sr-only'>Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : null
        ) : null}
      </label>

      {files.length > 0 ? (
        <Button
          size='lg'
          className='w-full mt-2'
          onClick={onUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <Spinner />
          ) : (
            `Upload ${files.length} file${files.length === 1 ? '' : 's'}`
          )}
        </Button>
      ) : null}
    </div>
  );
}
