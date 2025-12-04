import { TicketTypes } from 'src/services/events'

export const TICKET_TYPE_OPTIONS = [
  {
    id: TicketTypes.NORMAL,
    name: 'General Public Tickets',
    code: 'normal'
  },
  {
    id: TicketTypes.VIP,
    name: 'VIP Tickets',
    code: 'vip'
  },
  {
    id: TicketTypes.PPA_ULTIMATE_PASS,
    name: ' MLP | PPA Ultimate Pass',
    code: 'Ultimate'
  }
]
