import { parseUrl } from 'src/utils/url'
import { axiosInstance, axiosInstanceWithFile } from './base.service'
import { Params } from 'src/types'
import { AxiosRequestConfig } from 'axios'

export const API = {
  GET: async <Response>(url: string, data?: Params, config?: AxiosRequestConfig<object> | undefined) => {
    return (await axiosInstance.get(parseUrl(url, data || {}), config)).data as Response
  },

  POST: async <Response>(url = '', data?: Params, config?: AxiosRequestConfig<object> | undefined) => {
    const { vars, payload } = data || {}
    const body = data?.payload ? { ...data.payload } : undefined
    console.log('body', body)
    return (await axiosInstance.post(parseUrl(url, { vars }), body, config)).data as Response
  },

  POST_FILE: async <Response>(url = '', data?: Params) => {
    const { vars, payload } = data || {}
    const formData = new FormData()
    if (payload instanceof File || payload instanceof Blob) {
      formData.append('File', payload)
    } else {
      throw new Error('Payload must be a File or Blob type')
    }
    return (await axiosInstanceWithFile(true).post(parseUrl(url, { vars }), formData)).data as Response
  },
  PUT: async <Response>(url = '', data?: Params) => {
    const vars = data?.vars ?? {}
    const payload = data?.payload ?? {}

    const response = await axiosInstance.put(parseUrl(url, vars), payload)

    if (response) {
      return response.data as Response
    }
    throw new Error()
  },

  DELETE: async <Response>(url = '', data: Params) => {
    return (await axiosInstance.delete(parseUrl(url, data))).data as Response
  },

  //common
  upload: '/files/presigned-url',
  tags: '/common/tags',
  eventsMusicStyles: '/common/music-styles',

  //auth
  login: '/auth/admin/email/login',
  getMe: '/users/me',
  refreshToken: '/auth/refresh',
  register: '/auth/signup',
  logout: '/auth/logout',
  resendOTP: '/auth/resend-otp',
  verifyOTP: '/auth/verify-otp',

  //category
  categories: '/categories',
  categoryId: '/categories/{id}',

  //staff
  staff: '/admin/users',
  staffId: '/admin/users/{id}',
  bannedStaffId: '/admin/users/banned/{id}',
  unBannedStaffId: '/admin/users/unbanned/{id}',
  userResetPassword: '/admin/users/reset-password',

  staffChangePassword: '/staffs/change-password',
  //admin
  adminForgetPassword: '/auth/admin/forgot-password',
  adminResetPassword: '/auth/admin/reset-password',
  //music style
  musicStyle: '/music-styles',
  musicStyleId: '/music-styles/{id}',

  //artists
  artists: '/artists',
  artistId: '/artists/{id}',
  createArtistAccount: '/artists/{id}/create-account',
  artistProfile: '/artists/profile',

  // artist draft
  myPendingDraft: '/draft-artists/my-pending-draft',
  submitDraft: '/draft-artists/profile',
  draftArtistId: '/draft-artists/{id}',
  approveDraftArtist: '/draft-artists/admin/approve/{id}',

  // upload
  presignedUrl: '/files/presigned-url',

  //events
  events: '/events',
  eventId: '/events/{id}',
  eventsArtist: '/event/artists',
  eventsCategories: '/event/categories',
  eventsIdReview: '/events/{id}/review',
  addCarouselEvent: '/events/add-carousel-event',
  removeCarouselEvent: '/events/remove-carousel-event/{id}',

  //festival
  festival: '/festivals',
  festivalId: '/festivals/{id}',

  //connected-accounts
  connectedAccounts: '/connected-accounts',
  checkConnectedAccount: '/connected-accounts/account',
  getConnectedAccountLink: '/connected-accounts/account-link',
  refreshConnectedAccountLink: '/connected-accounts/refresh-account-link',

  //Featured Event
  trendingEvents: '/featured-event/trending-events',
  trendingEventsId: '/featured-event/trending-events/{id}',

  //Upcoming Event
  upcomingEvents: '/featured-event/upcoming-events',
  upcomingEventsId: '/featured-event/upcoming-events/{id}',

  //For Your Event
  forYouEvents: '/featured-event/for-you-events',
  forYouEventsId: '/featured-event/for-you-events/{id}',

  // partner
  partners: '/partners',
  partnerId: '/partners/{id}',

  //professional-directory
  professionalDirectory: '/professionals',
  professionalDirectoryId: '/professionals/{id}',

  // Recipe API
  recipe: '/admin/recipe',
  recipeId: '/admin/recipe/{id}'
}
