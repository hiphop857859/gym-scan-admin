import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { ProfessionalDirectoryDetail, ProfessionalDirectoryPayload, ProfessionalDirectories } from './types'

export const professionalDirectoryService = {
  getProfessionalDirectories: (params: PageParams) =>
    API.GET<ProfessionalDirectories>(API.professionalDirectory, { params }),
  createProfessionalDirectory: (payload: ProfessionalDirectoryPayload) =>
    API.POST<ProfessionalDirectoryDetail>(API.professionalDirectory, { payload }),
  getProfessionalDirectory: (vars: Vars) => API.GET<ProfessionalDirectoryDetail>(API.professionalDirectoryId, { vars }),
  updateProfessionalDirectory: (data: { vars: Vars; payload: Partial<ProfessionalDirectoryPayload> }) =>
    API.PUT<ProfessionalDirectoryDetail>(API.professionalDirectoryId, data),
  deleteProfessionalDirectory: (data: { vars: Vars }) =>
    API.DELETE<ProfessionalDirectoryDetail>(API.professionalDirectoryId, data)
}
