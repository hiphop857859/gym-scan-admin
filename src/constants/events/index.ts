import { EVENT_STATUS } from 'src/services/events/types'

export * from './tickets'

export const EVENT_STATUS_MAPPING_COLOR = {
  [EVENT_STATUS.PENDING]: 'warning',
  [EVENT_STATUS.APPROVED]: 'success',
  [EVENT_STATUS.REJECTED]: 'error'
}
