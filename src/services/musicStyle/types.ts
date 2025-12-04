import { ResponseDetail, ResponseList } from 'src/types'

export interface MusicStyle {
  id: string
  name: string
  description: string
  icon?: string
}

export interface MusicStyles extends ResponseList<MusicStyle> {}
export interface MusicStyleDetail extends ResponseDetail<MusicStyle> {}

export interface MusicStylePayload {
  name: string
  description: string
  icon?: string
}
