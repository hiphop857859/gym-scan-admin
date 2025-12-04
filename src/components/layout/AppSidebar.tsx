import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { COMPONENTS_LEFT_MENU } from 'src/constants/pagepath'
import { useSidebar } from 'src/provider/SidebarProvider'
import { LeftMenu } from 'src/types'
import { AngleDownIcon } from 'src/icons/AngleDownIcon'
import { useAuthStore } from 'src/store'
import { UserRole } from 'src/services/user/types'

const AppSidebar: React.FC = () => {
  const [authenticationData] = useAuthStore()

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
  const location = useLocation()
  const componentsLestMenu = useMemo(
    () =>
      COMPONENTS_LEFT_MENU.filter((c) =>
        c.roles.some((r) => authenticationData?.userInfo?.roles.includes(r as UserRole))
      ),
    [authenticationData.userInfo]
  )

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others'
    index: number
  } | null>(null)
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({})
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const isActive = (path: string) => location.pathname === path

  // useEffect(() => {
  //   let submenuMatched = false
  //   ;['main', 'others'].forEach((menuType) => {
  //     const items = menuType === 'main' ? navItems : othersItems
  //     items.forEach((nav, index) => {
  //       if (nav.subItems) {
  //         nav.subItems.forEach((subItem) => {
  //           if (isActive(subItem.path)) {
  //             setOpenSubmenu({
  //               type: menuType as 'main' | 'others',
  //               index
  //             })
  //             submenuMatched = true
  //           }
  //         })
  //       }
  //     })
  //   })

  //   if (!submenuMatched) {
  //     setOpenSubmenu(null)
  //   }
  // }, [location])

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0
        }))
      }
    }
  }, [openSubmenu])

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null
      }
      return { type: menuType, index }
    })
  }

  const renderMenuItems = (items: LeftMenu[], menuType: 'main' | 'others') => (
    <ul className='flex flex-col gap-4'>
      {items.map((nav, index) => (
        <li key={nav.code}>
          {nav.subMenu ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${!isExpanded && !isHovered ? 'lg:justify-start' : 'lg:justify-start'}`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.Icon && (
                  <nav.Icon
                    color={openSubmenu?.type === menuType && openSubmenu?.index === index ? '#738ff9' : '#fff'}
                    width={24}
                    height={24}
                  />
                )}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className='menu-item-text capitalize'>{nav.title}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <AngleDownIcon
                  className={`ml-auto transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index ? 'rotate-180 text-brand-500' : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                onClick={() => handleSubmenuToggle(index, menuType)}
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'}`}
              >
                <span className={`${isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`}>
                  {nav.Icon && <nav.Icon color={isActive(nav.path) ? '#738ff9' : '#fff'} width={24} height={24} />}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className='menu-item-text whitespace-nowrap '>{nav.title}</span>
                )}
              </Link>
            )
          )}
          {nav.subMenu && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el
              }}
              className='overflow-hidden transition-all duration-300'
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px'
              }}
            >
              <ul className='mt-2 space-y-1 ml-9'>
                {nav.subMenu.map((subItem) => (
                  <li key={subItem.code}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex justify-start`}>
        <Link to='/'>
          {isExpanded || isHovered || isMobileOpen ? (
            <div className='flex items-center gap-2'>
              <img className='dark:hidden' src='/images/logo/logo.svg' alt='Logo' width={40} height={40} />
              <img className='hidden dark:block' src='/images/logo/logo.svg' alt='Logo' width={40} height={40} />
              <span className='dark:text-white text-black whitespace-nowrap  '>Admin</span>
            </div>
          ) : (
            <img src='/images/logo/logo.svg' alt='Logo' width={40} height={40} />
          )}
        </Link>
      </div>
      <div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
        <nav className='mb-6'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${'justify-start'} ${
                  isExpanded || isHovered || (isMobileOpen && 'hidden')
                } `}
              >
                {'Dashboard'}
              </h2>
              {renderMenuItems(componentsLestMenu, 'main')}
            </div>

            {/* <div className=''>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${'justify-start'}`}>
                {isExpanded || isHovered || isMobileOpen ? 'Others' : <ArrowTopIcon />}
              </h2>
              {renderMenuItems(othersItems, 'others')}
            </div> */}
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default AppSidebar
