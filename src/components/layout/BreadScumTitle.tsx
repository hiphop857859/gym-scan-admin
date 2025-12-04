import { useLocation } from 'react-router-dom'
import { COMPONENTS_LEFT_MENU } from 'src/constants/pagepath'

const BreadScumTitle = () => {
  const location = useLocation()

  const {
    subMenu,
    path,
    title: _title
  } = COMPONENTS_LEFT_MENU.find((item) => {
    return item.subMenu
      ? !!item.subMenu.find((_item) => _item.path === location.pathname)
      : location.pathname === item.path
  }) || {}

  const title = path ? _title : subMenu?.find((__item) => __item.path === location.pathname)?.title

  return <p className='capitalize text-xl px-4 text-white'>{title}</p>
}

export default BreadScumTitle
