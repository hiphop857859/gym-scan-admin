import axios from 'axios'
import env from '../configs/index'
import { LOCAL_STORAGE_KEY } from 'src/enums'
import { Service } from 'src/services'
import { LocalStorage } from 'src/utils/localStorage.util'
import { stat } from 'fs'
import { message } from 'antd'
export const path = `${env.baseURL}`
console.log(path)
export function authHeader(attachFile: boolean = false) {
  let accessToken
  try {
    accessToken = LocalStorage.get(LOCAL_STORAGE_KEY.AUTH_TOKEN) as string
  } catch (error) {
    localStorage.clear()
    window.location.href = '/'
  }

  if (!accessToken) {
    return {
      'Content-type': 'application/json',
      Accept: 'application/json'
    }
  }

  if (attachFile) {
    return {
      'Content-Type': 'multipart/form-data;',
      Accept: 'application/json',
      authorization: `Bearer ${accessToken}`
    }
  }

  return {
    Accept: 'application/json',
    authorization: `Bearer ${accessToken}`
  }
}

export const axiosInstanceWithFile = (attachFile: boolean = false) =>
  axios.create({
    baseURL: `${path}`,
    headers: authHeader(attachFile)
  })

export const axiosInstance = axios.create({
  baseURL: `${path}`,
  headers: authHeader()
})

export const axiosInstanceGmail = axios.create({
  //   baseURL: `${pathEmail}`,
  //   headers: authHeaderForGmail()
})

export function authHeaderForGmail() {
  // let access_token = null;
  // try {
  //   access_token = JSON.parse(localStorage.getItem('tempUser') as string)?.access_token;
  // } catch (error) {
  //   localStorage.clear();
  //   window.location.href = '/';
  // }

  return {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const errorHandler = (status: number, error: any) => {
  // Optionally, handle refresh token failure (e.g., logout user)
  const msg = error?.response?.data?.message
  if (status === 401) {
    if (msg === 'SESSION_EXPIRED') {
      message.warning('Session expired. Please sign in again.')
      localStorage.clear()
      setTimeout(() => {
        window.location.href = '/signin'
      }, 800)
      return
    }

    if (msg === 'INVALID_TOKEN') {
      message.error('Invalid login. Please sign in again.')
      localStorage.clear()
      setTimeout(() => {
        window.location.href = '/signin'
      }, 800)
      return
    }

    // fallback
    localStorage.clear()
    window.location.href = '/signin'
  }
  if ([403].includes(status)) {
    // window.location.href = '/not-permission';
  }
  if ([500].includes(status)) {
    // window.location.href = '/error-server';
  }

  return Promise.reject(error)
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    const { status } = error.response || {}
    const originalRequest = error.config

    // Check if the error status is 401 and we haven't already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Get the refresh token from storage
        const refreshToken = LocalStorage.get(LOCAL_STORAGE_KEY.REFETCH_TOKEN) ?? ''

        if (!refreshToken) return errorHandler(status, error)

        // Call the refresh token endpoint
        const response = await Service.refreshToken({
          refreshToken
        })

        // Assuming your new token is returned in response.data.token
        const newToken = response.accessToken

        // Save the new token in your preferred storage (e.g., localStorage)
        LocalStorage.set(newToken, LOCAL_STORAGE_KEY.AUTH_TOKEN)

        // Update the Authorization header for both axios defaults and the original request
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`

        // Retry the original request with the new token
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Optionally, handle refresh token failure (e.g., logout user)
        return errorHandler(status, error)
      }
    }

    return errorHandler(status, error)
  }
)

axiosInstance.interceptors.request.use(
  (request: any) => {
    request.headers = { ...request.headers, ...authHeader() }
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstanceWithFile().interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {}
    if ([401].includes(status)) {
      localStorage.clear()
      window.location.href = '/signin'
    }
    if ([403].includes(status)) {
      // window.location.href = '/not-permission';
    }
    if ([500].includes(status)) {
      // window.location.href = '/error-server';
    }

    return Promise.reject(error)
  }
)

axiosInstanceWithFile().interceptors.request.use(
  (request: any) => {
    request.headers = { ...request.headers, ...authHeader() }
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)
