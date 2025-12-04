import { acceptedFiles, acceptedImageTypes } from 'src/constants/file'

export enum UploadTypes {
  CATEGORY = 'category',
  EVENT = 'event',
  ARTIST = 'artist',
  STAFF = 'staff',
  ADMIN = 'admin',
  PARTNER = 'partner'
}

export type AcceptedTypes = keyof typeof acceptedFiles
export type ContentType = (typeof acceptedFiles)[AcceptedTypes]

export type AcceptedImageTypes = keyof typeof acceptedImageTypes
export type ContentImageType = (typeof acceptedImageTypes)[AcceptedImageTypes]

export interface PresignedUrlPayload {
  fileName: string
  contentType: ContentType
  contentLength: number
  uploadType: UploadTypes
}

export interface PresignedUrlResponse {
  presignedUrl: string
  key: string
}

export enum UploadStatus {
  DONE = 'done',
  UPLOADING = 'uploading',
  ERROR = 'error'
}
