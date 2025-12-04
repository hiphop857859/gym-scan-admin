import { UploadFile } from 'antd'
import { ResponseList } from 'src/types'

interface OriginalImage extends UploadFile {
  isOriginal: boolean
}

export interface Artist {
  id: string
  name: string
  dateOfBirth: string
  placeOfBirth: string
  occupation: string
  description: string
  imageKeys: [OriginalImage | UploadFile]
  musicStyleIds: string[]
  type: string | null
  accountEmail: string | null
  draftArtistId: string | null
}

export type ArtistDetail = Omit<Artist, 'musicStyleIds'> & {
  musicStyles: Array<{
    id: string
    name: string
  }>
  images: Array<{
    id: string
    image: string
  }>
  socialMedia: {
    facebook: {
      name: string
      url: string
    }
    instagram: {
      name: string
      url: string
    }
    youtube: {
      name: string
      url: string
    }
    twitter: {
      name: string
      url: string
    }
  }
  longitude: string
  latitude: string
  location: string
  bookingContactEmail: string
  bookingContactPhoneNumber: string
  averageFee: string
  isFeeNegotiable: boolean
  technicalRequirements: string
  references: string[]
  listeningLinks: Array<{
    url: string
    name: string
  }>
  availabilityCalendar: Array<{
    note: string
    endDate: string
    startDate: string
  }>
}

export interface ArtistPayload extends Partial<Artist> {}

export interface ArtistResponseList extends ResponseList<Artist> {
  thumbnail?: string
}
