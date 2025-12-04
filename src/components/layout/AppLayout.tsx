import React from 'react'
// import { Outlet } from 'react-router'
import AppHeader from './AppHeader'
import Backdrop from './Backdrop'
import AppSidebar from './AppSidebar'
import { SidebarProvider, useSidebar } from 'src/provider/SidebarProvider'
import BreadScumTitle from './BreadScumTitle'

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()
  return (
    <div className='min-h-screen xl:flex'>
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
        } ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <AppHeader />
        <div
          className={`p-4 mx-auto  ${isExpanded || isHovered ? 'max-w-[calc(100vw-340px)]' : 'max-w-[calc(100vw-100px)]'}   md:p-6`}
        >
          <BreadScumTitle />
          {children}
        </div>
      </div>
    </div>
  )
}

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}

export default AppLayout
