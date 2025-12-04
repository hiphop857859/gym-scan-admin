export const acceptedImageTypes = {
  // '.svg': 'image/svg+xml',
  // '.tiff': 'image/tiff',
  // '.webp': 'image/webp',
  // '.avif': 'image/avif',
  // '.bmp': 'image/bmp',
  // '.gif': 'image/gif',
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg'
}

export const acceptedFileTypes = {
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pdf': 'application/pdf',
  '.xhtml': 'application/xhtml+xml',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.txt': 'text/plain',
  '.zip': 'application/zip',
  '.rar': 'application/vnd.rar'
}

export const acceptedVideoTypes = {
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.wmv': 'video/x-ms-wmv'
}
export const acceptedFiles = {
  ...acceptedFileTypes,
  ...acceptedImageTypes,
  ...acceptedVideoTypes
}

export type imageAccepted = keyof typeof acceptedImageTypes
export type fileAccepted = keyof typeof acceptedFileTypes

export type acceptedFilesType = keyof typeof acceptedFiles

export const maxSizeFile = 20 * 1024 * 1024 // 20mb
export const convertMB = (fileSize: number) => Math.ceil((fileSize / 1024 / 1024) * 100) / 100
