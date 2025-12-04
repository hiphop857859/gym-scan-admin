import { createStore } from './store'
import { response } from 'src/types'

export type recordModal = number | string | null | undefined | object | any

export interface IModalData {
  isLoading: boolean
  recordModalDelete: recordModal
  recordModalConfirmOut: recordModal
  recordModalReject: recordModal
  recordModalApprove: recordModal
  recordModalLoading: recordModal

  recordModalNotification?: response | null
  recordModalBanned: recordModal
  recordModalUnBanned: recordModal
  recordModalResetPassword: recordModal

  contentModalNotification: {
    titleSuccess: string
    titleFailed: string
  } | null
}
export interface IInitialAction {
  handleModalDeleteOk: (_record: recordModal, close?: () => void) => void
  handleModalDeleteCancel: (_record: recordModal, close?: () => void) => void

  handleModalResetPasswordOk: (_record: recordModal, close?: () => void) => void
  handleModalResetPasswordCancel: (_record: recordModal, close?: () => void) => void

  handleModalBannedOk: (_record: recordModal, close?: () => void) => void
  handleModalBannedCancel: (_record: recordModal, close?: () => void) => void

  handleModalUnBannedOk: (_record: recordModal, close?: () => void) => void
  handleModalUnBannedCancel: (_record: recordModal, close?: () => void) => void

  handleModalConfirmOutOk: (_record: recordModal, close?: () => void) => void
  handleModalConfirmOutCancel: (_record: recordModal, close?: () => void) => void
  confirmMessage?: string

  handleModalNotificationOk: (_record: recordModal, close?: () => void) => void
  handleModalNotificationCancel: (_record: recordModal, close?: () => void) => void

  handleModalRejectOk: (_record: { reject: { id: recordModal; reasonReject: string } }, close?: () => void) => void
  handleModalRejectCancel: (_record: recordModal, close?: () => void) => void
  rejectMessage?: string
  needRejectReason?: boolean

  handleModalApproveOk: (_record: recordModal, close?: () => void) => void
  handleModalApproveCancel: (_record: recordModal, close?: () => void) => void
  approveMessage?: string
}

const initialValue: IInitialAction & IModalData = {
  isLoading: false,
  recordModalDelete: null,
  handleModalDeleteOk: () => {},
  handleModalDeleteCancel: () => {},

  recordModalConfirmOut: null,
  handleModalConfirmOutOk: () => {},
  handleModalConfirmOutCancel: () => {},
  confirmMessage: null,

  recordModalNotification: null,
  contentModalNotification: null,
  handleModalNotificationOk: () => {},
  handleModalNotificationCancel: () => {},

  recordModalReject: null,
  handleModalRejectOk: () => {},
  handleModalRejectCancel: () => {},
  rejectMessage: '',
  needRejectReason: false,

  recordModalApprove: null,
  handleModalApproveOk: () => {},
  handleModalApproveCancel: () => {},
  approveMessage: '',

  recordModalLoading: null,

  recordModalBanned: null,
  handleModalBannedOk: () => {},
  handleModalBannedCancel: () => {},
  recordModalUnBanned: null,
  handleModalUnBannedOk: () => {},
  handleModalUnBannedCancel: () => {}
}

export const ModalStore = createStore(initialValue)

export const useModalStore = ModalStore.useStore
