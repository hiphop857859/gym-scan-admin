import { ResponseDetail, ResponseList } from 'src/types'

export interface Category {
  id: string
  name: string
  description: string
  imageKey: string
}

export interface CategoryDetail {
  id: string
  name: string
  description: string
  image: string
}

export interface Categories extends ResponseList<Category> {}
// export interface CategoryDetail extends ResponseDetail<Category> {}

export interface CategoryPayload {
  name: string
  description: string
  imageKey: string
}
