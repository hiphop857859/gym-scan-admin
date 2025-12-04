// import Dashboard from 'src/components/Pages/ManagePage/Dashboard'
import CategoryPage from 'src/components/Pages/ManagePage/CategoryPage'
import StaffPage from 'src/components/Pages/ManagePage/StaffPage'
import MusicStylePage from 'src/components/Pages/ManagePage/MusicStylePage'
import ArtistsPage from 'src/components/Pages/ManagePage/Artists'
import EventsPage from 'src/components/Pages/ManagePage/Events'
import ProfessionalDirectoryPage from 'src/components/Pages/ManagePage/ProfessionalDirectoryPage'
import { LeftMenu } from 'src/types'
import FestivalPage from 'src/components/Pages/ManagePage/Festival'
import { CharacteristicIcon } from 'src/icons/CharacteristicIcon'
import { CirclesFourIcon } from 'src/icons/CirclesFourIcon'
import { EquipmentIcon } from 'src/icons/EquipmentIcon'
// import { ExerciseIcon } from 'src/icons/ExerciseIcon'
import { MentalFactorIcon } from 'src/icons/MentalFactorIcon'
import { MotivationIcon } from 'src/icons/MotivationIcon'
import { PhysicalIcon } from 'src/icons/PhysicalIcon'
import { RoutineIcon } from 'src/icons/RoutineIcon'
import { UserRole } from 'src/services/user/types'
import AccountConnected from 'src/components/Pages/AccountConnected'
import RefreshAccountConnected from 'src/components/Pages/AccountConnected/refresh'
import CarouselEventsManagement from 'src/components/Pages/ManagePage/CarouseEvent'
import ChangePassword from 'src/components/Pages/ChangePassword'
import { SlidersOutlined } from '@ant-design/icons'
import ArtistProfile from 'src/components/Pages/ManagePage/ArtistProfile'
import PartnerPage from 'src/components/Pages/ManagePage/PartnerPage'
import { ComplimentaryIcon } from 'src/icons/ComplimentaryIcon'
import StraffPage from 'src/components/Pages/ManagePage/StaffPage'
import RecipePage from 'src/components/Pages/ManagePage/RecipePage'

export const COMPONENTS_PRIVATE_ADMIN_ROUTER = {
  // artists: {
  //   artists: {
  //     code: 'artists',
  //     path: '/artists',
  //     Component: ArtistsPage,
  //     title: 'Artists Management',
  //     roles: [UserRole.ADMIN]
  //   },
  //   profile: {
  //     code: 'artistProfile',
  //     path: '/artists/profile',
  //     Component: ArtistProfile,
  //     roles: [UserRole.ARTIST]
  //   },
  //   profileArtist: {
  //     code: 'artistProfile',
  //     path: '/artists/profile/:id',
  //     Component: ArtistProfile,
  //     roles: [UserRole.ADMIN]
  //   }
  // },
  // events: {
  //   events: {
  //     code: 'events',
  //     path: '/events',
  //     Component: EventsPage,
  //     title: 'Events Management',
  //     roles: [UserRole.ADMIN, UserRole.FESTIVAL_STAFF, UserRole.ASSOCIATION_STAFF]
  //   }
  // },
  // festivals: {
  //   festivals: {
  //     code: 'festivals',
  //     path: '/festivals',
  //     Component: FestivalPage,
  //     title: 'Organizers account',
  //     roles: [UserRole.ADMIN]
  //   }
  // },
  // professionalDirectory: {
  //   professionalDirectory: {
  //     code: 'professionalDirectory',
  //     path: '/professional-directory',
  //     Component: ProfessionalDirectoryPage,
  //     title: 'Professional Directory',
  //     roles: [UserRole.ADMIN, UserRole.FESTIVAL_STAFF]
  //   }
  // },
  staffs: {
    staff: {
      code: 'user',
      path: '/user',
      Component: StaffPage,
      title: 'User Management',
      roles: [UserRole.ADMIN]
    }
  },
  recipes: {
    recipe: {
      code: 'recipe',
      path: '/recipe',
      Component: RecipePage,
      title: 'Recipe Management',
      roles: [UserRole.ADMIN]
    }
  },
  // categories: {
  //   category: {
  //     code: 'category',
  //     path: '/category',
  //     Component: CategoryPage,
  //     title: 'Category Management',
  //     roles: [UserRole.ADMIN]
  //   }
  // },
  // musicStyles: {
  //   musicStyle: {
  //     code: 'musicStyle',
  //     path: '/music-style',
  //     Component: MusicStylePage,
  //     title: 'Music Style Management',
  //     roles: [UserRole.ADMIN]
  //   }
  // },
  // partners: {
  //   partner: {
  //     code: 'partner',
  //     path: '/partners',
  //     Component: PartnerPage,
  //     title: 'Partner Management',
  //     roles: [UserRole.ADMIN]
  //   }
  // },
  // accountConnected: {
  //   connected: {
  //     code: 'accountConnected',
  //     path: '/account-connected',
  //     Component: AccountConnected,
  //     title: 'Connected Account',
  //     roles: [UserRole.ADMIN, UserRole.FESTIVAL_STAFF, UserRole.ASSOCIATION_STAFF]
  //   },
  //   refresh: {
  //     code: 'refresh',
  //     path: '/account-connected/refresh',
  //     Component: RefreshAccountConnected,
  //     title: 'Connected Account',
  //     roles: [UserRole.ADMIN, UserRole.FESTIVAL_STAFF, UserRole.ASSOCIATION_STAFF]
  //   }
  // },
  // carouselEvents: {
  //   management: {
  //     code: 'carouselEventsManagement',
  //     path: '/carousel-events-management',
  //     Component: CarouselEventsManagement,
  //     title: 'Carousel Events',
  //     roles: [UserRole.ADMIN]
  //   }
  // },
  profile: {
    changePassword: {
      code: 'changePassword',
      path: '/change-password',
      Component: ChangePassword,
      title: 'Profile',
      roles: [UserRole.FESTIVAL_STAFF, UserRole.ASSOCIATION_STAFF]
    }
  }
}

type objectKeyType = keyof typeof COMPONENTS_PRIVATE_ADMIN_ROUTER

export const COMPONENTS_PRIVATE_ADMIN_FLATTED_MAP = Object.keys(COMPONENTS_PRIVATE_ADMIN_ROUTER)
  .map((i) =>
    Object.keys(COMPONENTS_PRIVATE_ADMIN_ROUTER[i as objectKeyType]).map((j) => {
      const objectKeyNestedType = COMPONENTS_PRIVATE_ADMIN_ROUTER[i as objectKeyType]
      type objectNestedKeyType = keyof typeof objectKeyNestedType
      return COMPONENTS_PRIVATE_ADMIN_ROUTER[i as objectKeyType][j as objectNestedKeyType]
    })
  )
  .flat()
export const COMPONENTS_LEFT_MENU: Array<LeftMenu> = [
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.artists.artists.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.artists.artists.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.artists.artists.path,
  //   Icon: RoutineIcon,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.artists.artists.roles
  // },
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.events.events.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.events.events.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.events.events.path,
  //   Icon: CirclesFourIcon,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.events.events.roles
  // },
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.festivals.festivals.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.festivals.festivals.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.festivals.festivals.path,
  //   Icon: MentalFactorIcon,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.festivals.festivals.roles
  // },
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.professionalDirectory.professionalDirectory.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.professionalDirectory.professionalDirectory.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.professionalDirectory.professionalDirectory.path,
  //   Icon: CharacteristicIcon,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.professionalDirectory.professionalDirectory.roles
  // },
  {
    code: COMPONENTS_PRIVATE_ADMIN_ROUTER.staffs.staff.code,
    title: COMPONENTS_PRIVATE_ADMIN_ROUTER.staffs.staff.title,
    path: COMPONENTS_PRIVATE_ADMIN_ROUTER.staffs.staff.path,
    Icon: CharacteristicIcon,
    roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.staffs.staff.roles
  },
  {
    code: COMPONENTS_PRIVATE_ADMIN_ROUTER.recipes.recipe.code,
    title: COMPONENTS_PRIVATE_ADMIN_ROUTER.recipes.recipe.title,
    path: COMPONENTS_PRIVATE_ADMIN_ROUTER.recipes.recipe.path,
    Icon: PhysicalIcon,
    roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.recipes.recipe.roles
  },
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.categories.category.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.categories.category.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.categories.category.path,
  //   Icon: PhysicalIcon,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.categories.category.roles
  // },
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.partners.partner.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.partners.partner.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.partners.partner.path,
  //   Icon: ComplimentaryIcon,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.partners.partner.roles
  // },
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.musicStyles.musicStyle.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.musicStyles.musicStyle.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.musicStyles.musicStyle.path,
  //   Icon: EquipmentIcon,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.musicStyles.musicStyle.roles
  // },
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.accountConnected.connected.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.accountConnected.connected.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.accountConnected.connected.path,
  //   Icon: MotivationIcon,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.accountConnected.connected.roles
  // },
  // {
  //   code: COMPONENTS_PRIVATE_ADMIN_ROUTER.carouselEvents.management.code,
  //   title: COMPONENTS_PRIVATE_ADMIN_ROUTER.carouselEvents.management.title,
  //   path: COMPONENTS_PRIVATE_ADMIN_ROUTER.carouselEvents.management.path,
  //   Icon: () => <SlidersOutlined style={{ fontSize: '21px', color: 'white' }} />,
  //   roles: COMPONENTS_PRIVATE_ADMIN_ROUTER.carouselEvents.management.roles
  // }
]
