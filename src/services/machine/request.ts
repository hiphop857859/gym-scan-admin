import { API } from '../api.service'
import { PageParams } from 'src/types'

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
  updateMachine: ({ id, payload }: { id: string; payload: FormData }) => {
    return API.PUT(`${API.machine}/${id}`, {
      payload
    })
  },
  createMachine: (params: { payload: FormData }) => {
    return API.POST(API.machine, params)
  }
}
