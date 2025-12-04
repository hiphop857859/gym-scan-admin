import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { Partner, PartnerPayload, Partners } from './types'

export const partnerService = {
  getPartners: (params: PageParams) => API.GET<Partners>(API.partners, { params }),
  createPartner: (payload: PartnerPayload) => API.POST<Partner>(API.partners, { payload }),
  getPartner: (vars: Vars) => API.GET<Partner>(API.partnerId, { vars }),
  updatePartner: (data: { vars: Vars; payload: Partial<PartnerPayload> }) => API.PUT<Partner>(API.partnerId, data),
  deletePartner: (data: { vars: Vars }) => API.DELETE<Partner>(API.partnerId, data)
}
