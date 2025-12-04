export interface AvatarPayload {
  file: File
}

export interface FileResponse {
  userId: string
  url: string
  key: string
}

export interface UserLoginPayload {
  email: string
  password: string
}

export type SignUpPayload = {
  email: string
  password: string
  name: string
}

export type verifyOTPPayload = {
  email: string
  otpCode: string
  type: string
}
export type ResetPasswordPayload = {
  token: string
  password: string
}
export type ResendOTPPayload = {
  email: string
  type: string
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user'
}
export interface UserInfo {
  id: string
  email: string
  roles: UserRole[]
}

export interface UserLoginDetail {
  token: string
  refreshToken: string
}

export interface RefreshTokenPayload {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export enum UserRole {
  ADMIN = 99,
  AMBASSADOR_MEMBER = 2,
  USER = 1,
  FESTIVAL_STAFF = 'Festival_Staff',
  ASSOCIATION_STAFF = 'Association_Staff',
  ARTIST = 'Artist'
}

export enum EUserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}
