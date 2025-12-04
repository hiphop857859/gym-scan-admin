import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { ChangePasswordPayload, ForgotPasswordPayload, StaffDetail, StaffPayload, Staffs } from './types'
import { ResetPasswordPayload } from '../user'

export const staffService = {
  getStaffs: (params: PageParams) => API.GET<Staffs>(API.staff, { params }),
  createStaff: (payload: StaffPayload) => API.POST<StaffDetail>(API.staff, { payload }),
  getStaff: (vars: Vars) => API.GET<StaffDetail>(API.staffId, { vars }),
  updateStaff: (data: { vars: Vars; payload: Partial<StaffPayload> }) =>
    API.PUT<StaffDetail>(API.staffId, { vars: { vars: data.vars }, payload: data.payload }),
  deleteStaff: (data: { vars: Vars }) => API.DELETE<StaffDetail>(API.staffId, { vars: data }),
  bannedStaff: (data: { vars: Vars }) => API.PUT<StaffDetail>(API.bannedStaffId, { vars: data }),
  unBannedStaff: (data: { vars: Vars }) => API.PUT<StaffDetail>(API.unBannedStaffId, { vars: data }),
  changePassword: (params: ChangePasswordPayload) => API.PUT<any>(API.staffChangePassword, { payload: params }),
  forgotPassword: (params: ForgotPasswordPayload) => API.PUT<any>(API.adminForgetPassword, { payload: params }),
  resetPasswordAdmin: (params: ResetPasswordPayload) => API.PUT<any>(API.adminResetPassword, { payload: params }),
  resetPassword: (data: { vars: Vars }) => API.PUT<any>(API.userResetPassword, { payload: { id: data.vars.id } })
}
