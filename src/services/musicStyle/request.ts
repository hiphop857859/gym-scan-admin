import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { MusicStyle, MusicStyleDetail, MusicStylePayload, MusicStyles } from './types'
import { AxiosRequestConfig } from 'axios'

export const musicStyleService = {
  getMusicStyles: (params: PageParams, config?: AxiosRequestConfig) =>
    API.GET<MusicStyles>(API.musicStyle, { params }, config),
  createMusicStyle: (payload: MusicStylePayload) => API.POST<MusicStyleDetail>(API.musicStyle, { payload }),
  getMusicStyle: (vars: Vars) => API.GET<MusicStyle>(API.musicStyleId, { vars }),
  updateMusicStyle: (data: { vars: Vars; payload: MusicStylePayload }) =>
    API.PUT<MusicStyleDetail>(API.musicStyleId, data),
  deleteMusicStyle: (data: { vars: Vars }) => API.DELETE<MusicStyleDetail>(API.musicStyleId, data)
}
