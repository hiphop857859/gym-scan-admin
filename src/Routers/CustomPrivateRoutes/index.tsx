import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

type propsRoutePrivateType = {
  check?: boolean | null
  redirectPath?: string
  children?: React.ReactElement
  isNoti?: boolean
}

const CustomPrivateRoute = ({
  check = false,
  redirectPath = '/not-found',
  children = <Outlet />
}: propsRoutePrivateType) => {
  if (check) {
    return children
  } else {
    // isNoti && openNotificationFail('Login to continute', 'topRight')
    return <Navigate to={redirectPath} replace />
  }
}
export default CustomPrivateRoute
