import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { CarouselEvents, CreateCarouselEventPayload, CarouselEventMethods, CarouseEventTypes } from './types'
import { AxiosRequestConfig } from 'axios'

const carouseEventsBuilder = (): CarouselEventMethods => {
  const schemaApi = [
    {
      url: API.trendingEvents,
      urlId: API.trendingEventsId,
      name: CarouseEventTypes.Trending
    },
    {
      url: API.upcomingEvents,
      urlId: API.upcomingEventsId,
      name: CarouseEventTypes.Upcoming
    },
    {
      url: API.forYouEvents,
      urlId: API.forYouEventsId,
      name: CarouseEventTypes.ForYou
    }
  ] as const

  return schemaApi.reduce((acc, { url, urlId, name }) => {
    return {
      ...acc,
      [`getCarouse${name}Events`]: (params: PageParams, config?: AxiosRequestConfig) =>
        API.GET<CarouselEvents>(url, { params }, config),
      [`createCarousel${name}Event`]: (payload: CreateCarouselEventPayload) => API.POST<any>(url, { payload }),
      [`deleteCarousel${name}Event`]: (data: { vars: Vars }) => API.DELETE<any>(urlId, data)
    }
  }, {} as CarouselEventMethods)
}

export const carouseEventsService = {
  ...carouseEventsBuilder()
}
