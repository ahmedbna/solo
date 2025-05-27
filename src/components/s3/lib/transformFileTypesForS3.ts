import { Accept } from 'react-dropzone';

export const transformFileTypesForS3: any = (fileTypes: Accept) => {
  const result = new Set();

  for (const [mimeType, extensions] of Object.entries(fileTypes)) {
    result.add(mimeType);
  }

  return Array.from(result);
};
