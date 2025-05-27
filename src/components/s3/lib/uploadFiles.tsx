'use client';

import { toast } from 'sonner';
import { getSignedURL } from '../actions';
import { Accept } from 'react-dropzone';
import { Id } from '@/convex/_generated/dataModel';

export type FileResponseType = {
  fileName: string;
  fileUrl: string;
  name: string;
  size: number;
  type: string;
  response: any;
};

type Props = {
  userId?: Id<'users'>;
  files: File[];
  accept?: Accept;
  onUploadBegin?: ({ file }: { file: string }) => void;
  onUploadProgress?: ({
    file,
    progress,
  }: {
    file: string;
    progress: number;
  }) => void;
};

export const uploadFiles = async (args: Props) => {
  return Promise.all(
    args.files.map(async (file: File) => {
      const convertedFile = file;

      const computeSHA256 = async (file: File) => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        return hashHex;
      };

      const awsResponse = await getSignedURL({
        userId: args.userId,
        accept: args.accept,
        fileType: convertedFile.type,
        fileSize: convertedFile.size,
        checksum: await computeSHA256(convertedFile),
      });

      if (awsResponse.success) {
        const response = await fetchWithProgress(
          awsResponse.success.signedUrl,
          {
            method: 'PUT',
            body: convertedFile,
            headers: new Headers({
              'Content-Type': getMimeType(convertedFile),
            }),
          },
          (progressEvent) =>
            args.onUploadProgress?.({
              file: convertedFile.name,
              progress: (progressEvent.loaded / progressEvent.total) * 100,
            }),
          () => {
            args.onUploadBegin?.({
              file: convertedFile.name,
            });
          }
        );

        return {
          name: convertedFile.name,
          size: convertedFile.size,
          type: convertedFile.type,
          fileUrl: awsResponse.success.fileUrl,
          fileName: awsResponse.success.fileName,
          response,
        };
      } else {
        toast.error(awsResponse.failure);
        return [] as any;
      }
    })
  );
};

export function fetchWithProgress(
  url: string,
  opts: {
    headers?: Headers;
    method?: string;
    body?: File;
  } = {},
  onProgress?: (this: XMLHttpRequest, progress: ProgressEvent) => void,
  onUploadBegin?: (this: XMLHttpRequest, progress: ProgressEvent) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(opts.method ?? 'get', url);
    opts.headers &&
      Object.keys(opts.headers).forEach(
        (h) =>
          opts.headers && xhr.setRequestHeader(h, opts.headers.get(h) ?? '')
      );
    xhr.onload = () => {
      resolve(xhr.response);
    };

    xhr.onerror = reject;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress;
    if (xhr.upload && onUploadBegin) xhr.upload.onloadstart = onUploadBegin;
    xhr.send(opts.body);
  });
}

export function getMimeType(file: File) {
  if (file.type === 'blob') {
    return 'application/octet-stream';
  } else if (file.type === 'pdf') {
    return 'application/pdf';
  } else {
    return file.type;
  }
}
