export interface MachineItem {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deviceName: string
  isGymMachine: boolean
  description: string | null
  imageNewUrl?: string | null
  videoNewUrl?: string | null
  muscleGroups: string[] | null
  machineKey: string
  primaryMuscles: string[]
  secondaryMuscles: string[]
  focusAreas: string[]
  instruction: string
  keyFormTips: string[]
  user: {
    id: string
    email: string
  }
}

export interface MachineList {
  page: number
  limit: number
  total: number
  totalPages: number
  data: MachineItem[]
}

export interface MachineDetail extends MachineItem {}
