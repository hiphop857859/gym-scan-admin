import { API } from '../api.service'
import { PresignedUrlPayload, PresignedUrlResponse } from './types'

export const uploadService = {
  presignedUrl: (payload: PresignedUrlPayload) => API.POST<PresignedUrlResponse>(API.presignedUrl, { payload })
}
