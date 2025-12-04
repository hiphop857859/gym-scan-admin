import { PageParams, ResponseList } from 'src/types'
import { Dayjs } from 'dayjs'

export interface TicketPrice {
  type: string
  name: string
  description: string
  price: number
}

export interface SocialMediaProfile {
  name: string
  url: string
}

export interface SocialMedia {
  facebook?: SocialMediaProfile
  instagram?: SocialMediaProfile
  youtube?: SocialMediaProfile
  twitter?: SocialMediaProfile
}

export interface EventVideo {
  id?: string
  videoKey: string
  originalName?: string
}

export interface Event {
  id: string
  name: string
  longitude: number
  latitude: number
  location: string
  startDate: string | Dayjs
  endDate: string | Dayjs
  description: string
  ticketPrices: TicketPrice[]
  socialMedia?: SocialMedia | null
  regulations: string[]
  imageKeys: string[]
  artistIds: string[]
  categoryIds: string[]
  musicStyleIds: string[]
  status?: EVENT_STATUS
  carouselEventId?: string
  contactEmail: string
  contactPhoneNumber?: string
  videoUrl?: string
  videos?: EventVideo[]
}

export interface EventsArtists {
  id: string
  name: string
  thumbnail: string
}

export interface EventsCategories {
  id: string
  name: string
}

export interface EventsMusicStyles {
  id: string
  name: string
}
export interface EventsQuery extends PageParams {
  minPrice?: number
  maxPrice?: number
  status?: EVENT_STATUS
}

export interface EventsArtistsResponseList extends ResponseList<EventsArtists> {}
export type EventsCategoriesResponseList = Array<EventsCategories>
export interface EventVideoPayload {
  id?: string
  videoKey: string
}

export interface EventPayload extends Partial<Omit<Event, 'videos'>> {
  videos?: EventVideoPayload[]
}
export interface EventResponseList extends ResponseList<Event> {}
export type EventsMusicStylesList = Array<EventsMusicStyles>

export interface AddCarouselEventPayload {
  eventId: string
}

export enum TicketTypes {
  NORMAL = 'normal',
  VIP = 'vip',
  PPA_ULTIMATE_PASS = 'ppa_ultimate_pass'
}

export enum EVENT_STATUS {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum VideoTypes {
  URL = 'url',
  FILE = 'file'
}
