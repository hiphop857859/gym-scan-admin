import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { Artist, ArtistDetail, ArtistPayload, ArtistResponseList } from './types'
import { AxiosRequestConfig } from 'axios'

export const artistsService = {
  getArtists: (params: PageParams, config?: AxiosRequestConfig) =>
    API.GET<ArtistResponseList>(API.artists, { params }, config),
  createArtist: (payload: ArtistPayload) => API.POST<Artist>(API.artists, { payload }),
  getArtist: (vars: Vars) => API.GET<ArtistDetail>(API.artistId, { vars }),
  updateArtist: (data: { vars: Vars; payload: ArtistPayload }) => API.PUT<Artist>(API.artistId, data),
  deleteArtist: (data: { vars: Vars }) => API.DELETE<any>(API.artistId, data),
  createArtistAccount: (data: { vars: Vars; payload: { email: string; password: string } }) =>
    API.POST<void>(API.createArtistAccount, data),
  artistProfile: () => API.GET<ArtistDetail>(API.artistProfile),
  myPendingDraft: () => API.GET<ArtistDetail>(API.myPendingDraft),
  submitDraftArtist: (payload: ArtistPayload) => API.PUT<ArtistDetail>(API.submitDraft, { payload }),
  getDraftArtist: (vars: Vars) => API.GET<ArtistDetail>(API.draftArtistId, { vars }),
  approveDraftArtist: (vars: Vars) => API.POST<void>(API.approveDraftArtist, { vars })
}
