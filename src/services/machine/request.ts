import { API } from '../api.service'
import { PageParams } from 'src/types'
import { axiosInstanceWithFile } from '../base.service'

export const machineService = {
  // GET LIST
  getMachines: (params: PageParams & { search?: string; sorts?: string }) => {
    return API.GET(API.machine, { params })
  },

  // GET DETAIL
  getMachineDetail: (id: string | boolean) => {
    return API.GET(API.machineId, { vars: { id } })
  },

  // UPDATE MACHINE (support FormData)
  // ✅ CREATE (FormData)
  createMachine: ({ payload }: { payload: FormData }) => {
    return axiosInstanceWithFile(true).post(API.machine, payload)
  },

  // ✅ UPDATE (FormData)
  updateMachine: ({ id, payload }: { id: string; payload: FormData }) => {
    return axiosInstanceWithFile(true).put(`${API.machine}/${id}`, payload)
  }
}
