import { ResponseList } from 'src/types'

export interface ProfessionalDirectory {
  id: string
  name: string
  companyName: string
  description: string
  phoneNumber: string
  email: string
}

export interface ProfessionalDirectories extends ResponseList<ProfessionalDirectory> {}
export interface ProfessionalDirectoryDetail extends ProfessionalDirectory {}

export interface ProfessionalDirectoryPayload {
  name: string
  companyName: string
  description: string
  phoneNumber: string
  email: string
}
