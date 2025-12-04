import { SVGProps } from 'react'
import { LANGUAGE } from 'src/constants'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
  active?: boolean
}
export type IconComponent = ({ color, ...props }: IconSvgProps) => JSX.Element

export interface MenuItem {}

export interface TOption<T> {
  label: string
  value: T
}

export type Vars = {
  id: string
  name?: string
  email?: string
}

export type VarsFunc = ({ id }: Vars) => void

export interface MetaResponse {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  totalPages: number
}

export interface ResponseList<T> {
  meta: MetaResponse
  data: Array<T>
}

export interface ResponseListNew<T> {
  meta: MetaResponse
  items: Array<T>
  limit: number
  page: number
  total: number
  totalPages: number
}
export interface ResponseDetail<T> {
  success: boolean
  message: string
  data: T
}

export type response = {
  success: Array<{ key: string; index: number; message: string }>
  errors: Array<{
    unique: string
    field: string
    indexError: number
    message: {
      value: string
    }
    value: string
  }>
  unknownErrors?: string
}
export interface Params {
  vars?: { [key: string]: string } | object
  params?: { [key: string]: string } | object
  payload?: object
}

export type LeftMenu = {
  code: string
  title: string
  path?: string
  Icon?: IconComponent
  roles: (string | number)[]
  subMenu?: {
    code: string
    path: string
    Component: () => JSX.Element
    title: string
    // Icon: ({ color, ...props }: IconSvgProps) => JSX.Element
  }[]
}

export interface PageParams {
  q?: string
  search?: string

  limit?: number
  page?: number
}

export type Language = {
  [K in (typeof LANGUAGE)[keyof typeof LANGUAGE]]: string
}

export interface SelectOption<T> {
  id: string
  name: string
  code: string
  record?: T
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
