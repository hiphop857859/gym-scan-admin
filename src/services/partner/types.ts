import { ResponseList } from 'src/types'
import { Category } from '../category'

export interface PartnerCategory {
  id: string
  partnerId: string
  categoryId: string
  category: Category
}
export interface Partner {
  id: string
  userId: string
  logoUrl: string
  bannerUrl: string
  companyName: string
  city: string
  operationalScope: string
  companyBio: string
  languagesSpoken: string
  contactEmail: string
  contactPhoneNumber: string
  socialMediaLinks: {
    facebook?: string
    instagram?: string
    [key: string]: string | undefined
  }
  befestCertification: boolean
  mediaGalleryUrls: string[]
  testimonials: { url: string; text: string }[]
  createdAt: string
  updatedAt: string
  categories: PartnerCategory[]
}

export enum OperationalScope {
  LOCAL = 'local',
  REGIONAL = 'regional',
  NATIONAL = 'national',
  INTERNATIONAL = 'international'
}

export interface Partners extends ResponseList<Partner> {}

export interface PartnerPayload {
  logo?: File | Blob
  banner?: File | Blob
  logoUrl?: string
  bannerUrl?: string
  companyName: string
  city: string
  operationalScope: OperationalScope
  companyBio: string
  languagesSpoken: string
  contactEmail: string
  contactPhoneNumber: string
  socialMediaLinks: Record<string, any>
  befestCertification: boolean
  mediaGalleries?: File[] | Blob[]
  mediaGalleryUrls?: string[]
  testimonials: { url: string; text: string }[]
  categoryIds: string[]
}
