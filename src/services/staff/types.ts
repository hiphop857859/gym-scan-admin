import { Language, ResponseList, ResponseListNew } from 'src/types'

export interface Staff {
  id: string
  name: Language
  email: string
  gender: string
  age: number
  phone: string
  imageKey: string
  address: string
  role: string
  isBanned: boolean
  password?: string
  startDate?: string
  appleId?: string
  googleId?: string
  status?: string
  roles?: number[]
}

export interface Staffs extends ResponseListNew<Staff> {}
export interface StaffDetail extends Omit<Staff, 'imageKey'> {
  image: string
}

export interface StaffPayload {
  name: Language
  email?: string
  phone?: string
  imageKey?: string
  address?: string
  role?: string
  gender?: string
  age?: number
  password?: string
  startDate?: string
  roles?: number[]
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
export interface ForgotPasswordPayload {
  email: string
}
