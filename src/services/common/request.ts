import { API } from '../api.service'
import { UploadDetail } from './types'

export const commonService = {
  uploadFile: (payload: File) => API.POST_FILE<UploadDetail>(API.upload, { payload })
}
