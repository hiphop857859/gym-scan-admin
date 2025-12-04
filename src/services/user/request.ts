import { API } from '../api.service'
import {
  UserLoginPayload,
  UserLoginDetail,
  UserInfo,
  RefreshTokenPayload,
  RefreshTokenResponse,
  SignUpPayload,
  verifyOTPPayload,
  ResendOTPPayload
} from './types'
import { AxiosRequestConfig } from 'axios'

export const serviceUser = {
  login: (payload: UserLoginPayload) => API.POST<UserLoginDetail>(API.login, { payload }),
  getMe: () => API.GET<UserInfo>(API.getMe),
  refreshToken: (payload: RefreshTokenPayload) =>
    API.POST<RefreshTokenResponse>(API.refreshToken, { payload }, {
      _retry: true // trick to avoid infinite loop
    } as AxiosRequestConfig),
  signUp: (payload: SignUpPayload) => API.POST<UserLoginDetail>(API.register, { payload }),
  verifyOTP: (payload: verifyOTPPayload) => API.POST<void>(API.verifyOTP, { payload }),
  resendOTP: (payload: ResendOTPPayload) => API.POST<void>(API.resendOTP, { payload })
}
