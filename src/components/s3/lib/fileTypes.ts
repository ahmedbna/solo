export const imageTypes = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tiff'],
  'image/svg+xml': ['.svg'],
  'image/webp': ['.webp'],
  'image/x-icon': ['.ico'], // Fixed .icon to .ico
};

export const videoTypes = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogv'], // Corrected extension for Ogg video
  'video/mpeg': ['.mpeg'],
  'video/x-msvideo': ['.avi'],
  'video/quicktime': ['.mov'], // Added correct MIME type for .mov
  'video/x-ms-wmv': ['.wmv'],
  'video/x-flv': ['.flv'],
};

export const audioTypes = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.oga', '.ogg'], // Added correct MIME type for .oga
  'audio/midi': ['.mid', '.midi'], // Corrected to .midi
  'audio/aac': ['.aac'],
  'audio/flac': ['.flac'],
  'audio/mp4': ['.m4a'], // Added correct MIME type for .m4a
  'audio/webm;codecs=opus': ['.webm'], // Added new audio type
};

export const pdfTypes = {
  'application/pdf': ['.pdf'],
};

export const docTypes = {
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
  ],
  'application/rtf': ['.rtf'],
  'application/zip': ['.zip'],
  'application/gzip': ['.gz'],
  'application/x-tar': ['.tar'],
  'application/vnd.rar': ['.rar'], // Corrected MIME type for RAR
  'application/x-bzip2': ['.bz2'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
};
