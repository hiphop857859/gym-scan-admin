import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import {
  Event,
  EventPayload,
  EventResponseList,
  EventsArtistsResponseList,
  EventsCategoriesResponseList,
  EVENT_STATUS,
  EventsMusicStylesList,
  EventsQuery,
  AddCarouselEventPayload,
  EventsCategories,
  EventsMusicStyles,
  EventsArtists
} from './types'
import { AxiosRequestConfig } from 'axios'

export const eventsService = {
  getEvents: (params: EventsQuery, config?: AxiosRequestConfig) =>
    API.GET<EventResponseList>(API.events, { params }, config),
  createEvent: (payload: EventPayload) => API.POST<Event>(API.events, { payload }),
  getEvent: (vars: Vars) =>
    API.GET<
      Omit<Event, 'categoryIds'> & {
        categories: EventsCategories[]
        musicStyles: EventsMusicStyles[]
        artists: EventsArtists[]
        images: { id: string; image: string }[]
      }
    >(API.eventId, {
      vars
    }),
  updateEvent: (data: { vars: Vars; payload: EventPayload }) => API.PUT<Event>(API.eventId, data),
  deleteEvent: (data: { vars: Vars }) => API.DELETE<any>(API.eventId, data),
  getEventsArtists: (params: PageParams, config?: AxiosRequestConfig) =>
    API.GET<EventsArtistsResponseList>(API.eventsArtist, { params }, config),
  getEventsCategories: (params: PageParams, config?: AxiosRequestConfig) =>
    API.GET<EventsCategoriesResponseList>(API.eventsCategories, { params }, config),
  updateEventStatus: (data: {
    vars: Vars
    payload: {
      status: EVENT_STATUS
    }
  }) => API.POST<Event>(API.eventsIdReview, data),
  getEventsMusicStyles: (params: PageParams, config?: AxiosRequestConfig) =>
    API.GET<EventsMusicStylesList>(API.eventsMusicStyles, { params }, config),
  addCarouselEvent: (data: { vars: Vars; payload: AddCarouselEventPayload }) =>
    API.POST<Event>(API.addCarouselEvent, data),
  removeCarouselEvent: (data: { vars: Vars }) => API.DELETE<Event>(API.removeCarouselEvent, data)
}
