'use server';

import crypto from 'crypto';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Accept } from 'react-dropzone';
import { transformFileTypesForS3 } from './lib/transformFileTypesForS3';
import { Id } from '@/convex/_generated/dataModel';

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const s3Client = new S3Client({
  region: process.env.AWS_BNA_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_BNA_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_BNA_SECRET_ACCESS_KEY!,
  },
});

const maxFileSize = 1048576 * 100; // 10 MB

type GetSignedURLParams = {
  userId?: Id<'users'>;
  accept?: Accept;
  fileType: string;
  fileSize: number;
  checksum: string;
};

export async function getSignedURL({
  userId,
  accept,
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams) {
  if (!userId) {
    return { failure: 'Not Authenticated!' };
  }

  const allowedFileTypes = transformFileTypesForS3(accept!);

  if (!allowedFileTypes.includes(fileType)) {
    return { failure: 'File type not allowed' };
  }

  if (fileSize > maxFileSize) {
    return { failure: 'File size too large' };
  }

  const fileName = generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BNA_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: userId,
    },
  });

  const signedUrl = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 120 } // 120 seconds
  );

  return {
    success: {
      signedUrl,
      fileUrl: signedUrl.split('?')[0],
      fileName: fileName,
    },
  };
}

export async function deleteFile(key: string) {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_BNA_BUCKET_NAME!,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (e) {
    console.error(e);
  }
}
