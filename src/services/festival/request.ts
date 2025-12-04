import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { FestivalDetail, FestivalPayload, Festivals } from './types'

export const festivalService = {
  getFestivals: (params: PageParams) => API.GET<Festivals>(API.festival, { params }),
  createFestival: (payload: FestivalPayload) => API.POST<FestivalDetail>(API.festival, { payload }),
  getFestival: (vars: Vars) => API.GET<FestivalDetail>(API.festivalId, { vars }),
  updateFestival: (data: { vars: Vars; payload: FestivalPayload }) => API.PUT<FestivalDetail>(API.festivalId, data),
  deleteFestival: (data: { vars: Vars }) => API.DELETE<FestivalDetail>(API.festivalId, data)
}
