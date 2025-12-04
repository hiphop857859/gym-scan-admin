import { ResponseList, PageParams, Vars } from 'src/types'
import { AxiosRequestConfig } from 'axios'

export interface CarouselEvent {
  id: string
  name: string
  startDate: string
  location: string
  thumbnail: string
  status: string
  carouselEventId: string
}

export interface CarouselEvents extends ResponseList<CarouselEvent> {}

export interface CreateCarouselEventPayload {
  eventIds: string[]
}

export interface DeleteCarouselEventPayload extends CreateCarouselEventPayload {}

export enum CarouseEventTypes {
  Trending = 'Trending',
  Upcoming = 'Upcoming',
  ForYou = 'ForYou'
}

export type CarouselEventMethods = {
  [K in CarouseEventTypes as `getCarouse${K}Events`]: (
    params: PageParams,
    config?: AxiosRequestConfig
  ) => Promise<CarouselEvents>
} & {
  [K in CarouseEventTypes as `createCarousel${K}Event`]: (payload: CreateCarouselEventPayload) => Promise<any>
} & {
  [K in CarouseEventTypes as `deleteCarousel${K}Event`]: (data: { vars: Vars }) => Promise<any>
}
