import { categoryService } from './category'
import { commonService } from './common'
import { musicStyleService } from './musicStyle'
import { staffService } from './staff'
import { serviceUser } from './user'
import { artistsService } from './artists'
import { uploadService } from './upload'
import { eventsService } from './events'
import { festivalService } from './festival'
import { carouseEventsService } from './carouseEvents'
import { connectedAccountsService } from './connectedAccount'
import { partnerService } from './partner'
import { professionalDirectoryService } from './professional-directory'
import { recipeService } from './recipe'
import { machineService } from './machine'

export const Service = {
  ...commonService,
  ...categoryService,
  ...musicStyleService,
  ...staffService,
  ...serviceUser,
  ...artistsService,
  ...uploadService,
  ...eventsService,
  ...festivalService,
  ...connectedAccountsService,
  ...carouseEventsService,
  ...partnerService,
  ...professionalDirectoryService,
  ...recipeService,
  ...machineService
}
