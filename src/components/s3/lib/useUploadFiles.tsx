'use client';

import { useRef, useState } from 'react';
import { useEvent } from './useEvent';
import { FileResponseType, uploadFiles } from './uploadFiles';
import { Accept } from 'react-dropzone';
import { Id } from '@/convex/_generated/dataModel';

type Props = {
  userId?: Id<'users'>;
  accept?: Accept;
  onUploadComplete?: (res: FileResponseType[]) => Promise<void>;
  onUploadProgress?: (p: number) => void;
  onUploadError?: (e: Error) => void; // Ensure the error type is consistent
  onUploadBegin?: (fileName: string) => void;
};

type ResponseType = {
  startUpload: (files: File[]) => Promise<FileResponseType[]>;
  isUploading: boolean;
};

export const useUploadFiles = ({
  userId,
  accept,
  onUploadComplete,
  onUploadProgress,
  onUploadError,
  onUploadBegin,
}: Props): ResponseType => {
  const uploadProgress = useRef(0);
  const [isUploading, setUploading] = useState(false);
  const fileProgress = useRef<Map<string, number>>(new Map());

  const startUpload = useEvent(async (files: File[]) => {
    setUploading(true);

    try {
      const res = await uploadFiles({
        userId,
        files,
        accept,
        onUploadProgress: ({ file, progress }) => {
          if (!onUploadProgress) return;

          fileProgress.current.set(file, progress);
          let totalProgress = 0;
          fileProgress.current.forEach((progressValue) => {
            totalProgress += progressValue;
          });

          const averageProgress =
            Math.floor(totalProgress / fileProgress.current.size / 10) * 10;

          if (averageProgress !== uploadProgress.current) {
            onUploadProgress(averageProgress);
            uploadProgress.current = averageProgress;
          }
        },
        onUploadBegin: ({ file }) => {
          onUploadBegin?.(file);
        },
      });

      await onUploadComplete?.(res);
      return res;
    } catch (error) {
      const formattedError =
        error instanceof Error ? error : new Error(String(error));
      console.error('Upload error:', formattedError); // Log the error for debugging
      onUploadError?.(formattedError);
      return [];
    } finally {
      setUploading(false);
      fileProgress.current = new Map();
      uploadProgress.current = 0;
    }
  });

  return {
    startUpload,
    isUploading,
  };
};
