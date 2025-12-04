import { createStore } from './store'
import { UserInfo } from 'src/services/user/types'

export interface IAuthData {
  userInfo: UserInfo | null
  isAuthenticationInProgress: boolean
  artistInfo?: any | null
}

const initialValue: IAuthData = {
  userInfo: null,
  isAuthenticationInProgress: true,
  artistInfo: null
}

export const AuthAppStore = createStore<IAuthData>(initialValue)

export const useAuthStore = AuthAppStore.useStore
