import React, { Fragment, Suspense, useState, useEffect, useCallback, useMemo } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LOCAL_STORAGE_KEY } from 'src/enums'
import { COMPONENTS_PRIVATE_ADMIN_FLATTED_MAP } from '../constants/pagepath'
import AppLayout from 'src/components/layout/AppLayout'
import SignIn from 'src/components/Pages/AuthPages/SignIn'
import SignUp from 'src/components/Pages/AuthPages/SignUp'
import NotFoundPage from 'src/components/Errors/ErrorPage'
import CustomPrivateRoute from './CustomPrivateRoutes'
import { useAuthStore } from 'src/store'
import ModalContainer from 'src/components/Containers/ModalContainer'
import { Service } from 'src/services'
import Spin from 'src/components/Atomic/Spin/Spin'
import { UserRole, UserInfo } from 'src/services/user/types'
import { cloneDeep as _cloneDeep } from 'lodash'
import VerifyOTP from 'src/components/Pages/AuthPages/VerifyOTP'
import ForgetPassword from 'src/components/Pages/AuthPages/ForgetPassword'
import ResetPassword from 'src/components/Pages/AuthPages/ResetPassword'

type typeRenderComponent = {
  Component: React.FunctionComponent<any>
  path: string
  code: string
  title: string
}

const Routers = () => {
  const [authenticationData, updateAuthenticationData] = useAuthStore()
  const [privateComponent, setPrivateComponent] = useState<typeRenderComponent[]>([])
  const isAuthed = useMemo(() => !!authenticationData?.userInfo?.id, [authenticationData?.userInfo])
  const normalizeComponents = useCallback((component: typeRenderComponent[]) => {
    if (!component?.length) return []

    const componentSettings = _cloneDeep(component)
    const hasEmptyPath = componentSettings.some((c: typeRenderComponent) => c.path === '/')
    const [firstComponentSettings] = componentSettings
    const firstPath = (firstComponentSettings as typeRenderComponent).path
    if (!hasEmptyPath && firstPath) {
      const customSettings: typeRenderComponent = {
        Component: () => <CustomPrivateRoute redirectPath={firstPath} check={false} />,
        path: '/',
        code: 'custom',
        title: 'customDefaultSettings'
      }

      componentSettings.unshift(customSettings)
    }

    return componentSettings
  }, [])

  const componentsNormalized = useMemo(
    () => normalizeComponents(COMPONENTS_PRIVATE_ADMIN_FLATTED_MAP),
    [normalizeComponents]
  )

  const getPrivateComponent = useCallback((user: UserInfo) => {
    if (!user) {
      return []
    }

    const userRoles = user?.roles || []
    const privateComponent =
      user && userRoles
        ? COMPONENTS_PRIVATE_ADMIN_FLATTED_MAP.filter((componentSetting) => {
          const { roles } = componentSetting || {}

          return Array.isArray(roles) && (roles as UserRole[]).some((role) => userRoles?.includes(role))
        })
        : []

    return privateComponent
  }, [])

  useEffect(() => {
    if (!authenticationData.isAuthenticationInProgress) {
      return
    }

    const fetchUser = async () => {
      try {
        let userInfo = authenticationData.userInfo
        let artistInfo = null
        if (!userInfo) {
          const token =
            localStorage.getItem(LOCAL_STORAGE_KEY.REFETCH_TOKEN) && localStorage.getItem(LOCAL_STORAGE_KEY.AUTH_TOKEN)

          if (!token) throw new Error('Token not found')
          const getMeResult = await Service.getMe()
          userInfo = getMeResult
          if (userInfo.roles?.includes(UserRole.ARTIST)) {
            const artistResult = await Service.artistProfile()
            artistInfo = artistResult
          }
        }

        const componentSettings: typeRenderComponent[] = normalizeComponents(getPrivateComponent(userInfo))

        updateAuthenticationData((pre) => ({
          ...pre,
          isAuthenticationInProgress: false,
          userInfo: userInfo,
          artistInfo
        }))
        setPrivateComponent(componentSettings)
      } catch (error) {
        localStorage.clear()
        updateAuthenticationData(() => ({
          isAuthenticationInProgress: false,
          userInfo: null
        }))
      }
    }

    fetchUser()
  }, [
    authenticationData.isAuthenticationInProgress,
    getPrivateComponent,
    setPrivateComponent,
    updateAuthenticationData,
    authenticationData.userInfo,
    normalizeComponents
  ])

  if (authenticationData.isAuthenticationInProgress)
    return (
      <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center  bg-opacity-75 z-50'>
        <Spin spinning={true} />
      </div>
    )

  return (
    <BrowserRouter>
      <Routes>
        <Fragment>
          <Route element={<CustomPrivateRoute redirectPath='/signin' check={!!isAuthed} />}>
            {(!authenticationData?.userInfo ? componentsNormalized : privateComponent).map(
              ({ Component, path }: typeRenderComponent) => (
                <Route
                  element={
                    <AppLayout>
                      <Suspense fallback={<ModalContainer footer={false} isLoading></ModalContainer>}>
                        <Component></Component>
                      </Suspense>
                    </AppLayout>
                  }
                  key={path}
                  path={path}
                ></Route>
              )
            )}
          </Route>
        </Fragment>

        {/* <Route element={<CustomPrivateRoute redirectPath={defaultPath} isNoti={false} check={!user?.userId} />}>
          <Route path='/auth' element={<Login />}></Route>
        </Route> */}
        <Route element={<CustomPrivateRoute redirectPath='/' check={!isAuthed} />}>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/verify-otp/:email' element={<VerifyOTP />} />
          <Route path='/forgot-password' element={<ForgetPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />

        </Route>

        <Route path='/not-found' element={<NotFoundPage />}></Route>
        {/* <Route
          path='/not-permission'
          element={
            <ErrorPage status={'403'} title='403' subTitle='Sorry, you are not authorized to access this page.' />
          }
        ></Route>
        <Route
          path='/error-server'
          element={<ErrorPage status={'500'} title='500' subTitle='Sorry, something went wrong.' />}
        ></Route> */}
        <Route path='*' element={<Navigate to='/not-found' />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routers
