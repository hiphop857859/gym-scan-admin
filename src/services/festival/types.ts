import { ResponseDetail, ResponseList } from 'src/types'

export interface Festival {
  id: string
  name: string
  description: string
  email: string
  phone: string
  avatar: string
}

export interface Festivals extends ResponseList<Festival> {}
export interface FestivalDetail extends ResponseDetail<Festival> {}

export interface FestivalPayload {
  name: string
  description: string
  email: string
  phone: string
  avatar: string
}
