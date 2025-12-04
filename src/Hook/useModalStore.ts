import { useCallback, useRef } from 'react'
import { IInitialAction, IModalData, recordModal, useModalStore } from 'src/store/modal.store'
import { response } from 'src/types'

const initialAction: IInitialAction & IModalData = {
  isLoading: false,
  recordModalConfirmOut: null,
  recordModalDelete: null,
  recordModalResetPassword: null,
  contentModalNotification: null,
  recordModalReject: null,
  recordModalApprove: null,
  recordModalLoading: null,
  recordModalBanned: null,
  recordModalUnBanned: null,
  handleModalDeleteOk: (_record, close) => close && close(),
  handleModalDeleteCancel: (_record, close) => close && close(),
  handleModalResetPasswordOk: (_record, close) => close && close(),
  handleModalResetPasswordCancel: (_record, close) => close && close(),
  handleModalBannedOk: (_record, close) => close && close(),
  handleModalBannedCancel: (_record, close) => close && close(),
  handleModalUnBannedOk: (_record, close) => close && close(),
  handleModalUnBannedCancel: (_record, close) => close && close(),
  handleModalConfirmOutOk: (_record, close) => close && close(),
  handleModalConfirmOutCancel: (_record, close) => close && close(),

  handleModalNotificationOk: (_record, close) => close && close(),
  handleModalNotificationCancel: (_record, close) => close && close(),

  handleModalApproveOk: (_record, close) => close && close(),
  handleModalApproveCancel: (_record, close) => close && close(),

  handleModalRejectOk: (_record, close) => close && close(),
  handleModalRejectCancel: (_record, close) => close && close()
}

export const useModals = (action: Partial<IInitialAction> = initialAction) => {
  const _action = useRef({ ...initialAction, ...action })

  const [, updateModalStore] = useModalStore()

  const closeModalDelete = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.recordModalDelete = initialAction.recordModalDelete
      prevState.handleModalDeleteOk = initialAction.handleModalDeleteOk
      prevState.handleModalDeleteCancel = initialAction.handleModalDeleteCancel
    })
  }, [updateModalStore])
  const closeModalResetPassword = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.recordModalResetPassword = initialAction.recordModalResetPassword
      prevState.handleModalResetPasswordOk = initialAction.handleModalResetPasswordOk
      prevState.handleModalResetPasswordCancel = initialAction.handleModalResetPasswordCancel
    })
  }, [updateModalStore])

  const closeModalBanned = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.recordModalBanned = initialAction.recordModalBanned
      prevState.handleModalBannedOk = initialAction.handleModalBannedOk
      prevState.handleModalBannedCancel = initialAction.handleModalBannedCancel
    })
  }, [updateModalStore])

  const closeModalUnBanned = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.recordModalUnBanned = initialAction.recordModalUnBanned
      prevState.handleModalUnBannedOk = initialAction.handleModalUnBannedOk
      prevState.handleModalUnBannedCancel = initialAction.handleModalUnBannedCancel
    })
  }, [updateModalStore])

  const openModalDelete = useCallback(
    (record: recordModal) => {
      updateModalStore((prevState) => {
        prevState.recordModalDelete = record
        prevState.handleModalDeleteOk = (_record) => {
          _action.current.handleModalDeleteOk(_record, closeModalDelete)
          updateModalStore((_prevState) => {
            _prevState.isLoading = true
          })
        }
        prevState.handleModalDeleteCancel = (_record) => {
          _action.current.handleModalDeleteCancel(_record, closeModalDelete)
        }
      })
    },
    [closeModalDelete, updateModalStore]
  )
  const openModalResetPassword = useCallback(
    (record: recordModal) => {
      console.log(record)
      updateModalStore((prevState) => {
        prevState.recordModalResetPassword = record
        prevState.handleModalResetPasswordOk = (_record) => {
          _action.current.handleModalResetPasswordOk(_record, closeModalResetPassword)
          updateModalStore((_prevState) => {
            _prevState.isLoading = true
          })
        }
        prevState.handleModalResetPasswordCancel = (_record) => {
          _action.current.handleModalResetPasswordCancel(_record, closeModalResetPassword)
        }
      })
    },
    [closeModalResetPassword, updateModalStore]
  )
  const openModalBanned = useCallback(
    (record: recordModal) => {
      updateModalStore((prevState) => {
        prevState.recordModalBanned = record
        prevState.handleModalBannedOk = (_record) => {
          _action.current.handleModalBannedOk(_record, closeModalBanned)
          updateModalStore((_prevState) => {
            _prevState.isLoading = true
          })
        }
        prevState.handleModalBannedCancel = (_record) => {
          _action.current.handleModalBannedCancel(_record, closeModalBanned)
        }
      })
    },
    [closeModalBanned, updateModalStore]
  )
  const openModalUnBanned = useCallback(
    (record: recordModal) => {
      updateModalStore((prevState) => {
        prevState.recordModalUnBanned = record
        prevState.handleModalUnBannedOk = (_record) => {
          _action.current.handleModalUnBannedOk(_record, closeModalUnBanned)
          updateModalStore((_prevState) => {
            _prevState.isLoading = true
          })
        }
        prevState.handleModalUnBannedCancel = (_record) => {
          _action.current.handleModalUnBannedCancel(_record, closeModalUnBanned)
        }
      })
    },
    [closeModalUnBanned, updateModalStore]
  )
  const closeModalConfirmOut = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.recordModalConfirmOut = initialAction.recordModalConfirmOut
      prevState.handleModalConfirmOutOk = initialAction.handleModalConfirmOutOk
      prevState.handleModalConfirmOutCancel = initialAction.handleModalConfirmOutCancel
    })
  }, [updateModalStore])

  const openModalConfirmOut = useCallback(
    (record: recordModal, confirmMessage?: string) => {
      updateModalStore((prevState) => {
        prevState.recordModalConfirmOut = record
        prevState.confirmMessage = confirmMessage || 'Are you sure for cancel current action ?'
        prevState.handleModalConfirmOutOk = (_record) => {
          _action.current.handleModalConfirmOutOk(_record, closeModalConfirmOut)
        }
        prevState.handleModalConfirmOutCancel = closeModalConfirmOut
      })
    },
    [closeModalConfirmOut, updateModalStore]
  )

  const closeModalNotification = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.contentModalNotification = initialAction.contentModalNotification
      prevState.handleModalNotificationOk = initialAction.handleModalNotificationOk
      prevState.handleModalNotificationCancel = initialAction.handleModalNotificationCancel
    })
  }, [updateModalStore])

  const openModalNotification = useCallback(
    (_: response, content: { titleSuccess: string; titleFailed: string }) => {
      updateModalStore((prevState) => {
        prevState.contentModalNotification = content
        prevState.handleModalNotificationOk = (_record) => {
          _action.current.handleModalNotificationOk(_record, closeModalNotification)
        }
        prevState.handleModalNotificationCancel = (_record) => {
          _action.current.handleModalNotificationCancel(_record, closeModalNotification)
        }
      })
    },
    [closeModalNotification, updateModalStore]
  )

  const closeModalReject = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.recordModalReject = initialAction.recordModalReject
      prevState.handleModalRejectOk = initialAction.handleModalRejectOk
      prevState.handleModalRejectCancel = initialAction.handleModalRejectCancel
    })
  }, [updateModalStore])

  const openModalReject = useCallback(
    (options: { record: recordModal; message?: string; needRejectReason?: boolean }) => {
      updateModalStore((prevState) => {
        prevState.recordModalReject = options.record
        prevState.needRejectReason = options.needRejectReason || false
        prevState.rejectMessage = options.message || undefined
        prevState.handleModalRejectOk = (_record) => {
          _action.current.handleModalRejectOk(_record, closeModalReject)
          updateModalStore((_prevState) => {
            _prevState.isLoading = true
          })
        }

        prevState.handleModalRejectCancel = (_record) => {
          _action.current.handleModalRejectCancel(_record, closeModalReject)
        }
      })
    },
    [closeModalReject, updateModalStore]
  )
  const closeModalApprove = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.recordModalApprove = initialAction.recordModalApprove
      prevState.handleModalApproveOk = initialAction.handleModalApproveOk
      prevState.handleModalApproveCancel = initialAction.handleModalApproveCancel
    })
  }, [updateModalStore])

  const openModalApprove = useCallback(
    (options: { record: recordModal; message?: string }) => {
      updateModalStore((prevState) => {
        prevState.recordModalApprove = options.record
        prevState.approveMessage = options.message || undefined
        prevState.handleModalApproveOk = (_record) => {
          _action.current.handleModalApproveOk(_record, closeModalApprove)
          updateModalStore((_prevState) => {
            _prevState.isLoading = true
          })
        }
        prevState.handleModalApproveCancel = (_record) => {
          _action.current.handleModalApproveCancel(_record, closeModalApprove)
        }
      })
    },
    [closeModalApprove, updateModalStore]
  )

  const closeModalLoading = useCallback(() => {
    updateModalStore((prevState) => {
      prevState.isLoading = initialAction.isLoading
      prevState.recordModalLoading = initialAction.recordModalLoading
    })
  }, [updateModalStore])

  const openModalLoading = useCallback(
    async (record: recordModal) => {
      await updateModalStore((prevState) => {
        prevState.isLoading = true
        prevState.recordModalLoading = record
      })
    },
    [updateModalStore]
  )

  return {
    closeModalBanned,
    closeModalDelete,
    closeModalUnBanned,
    openModalDelete,
    openModalBanned,
    openModalUnBanned,
    closeModalConfirmOut,
    openModalConfirmOut,
    closeModalNotification,
    openModalNotification,
    closeModalApprove,
    openModalApprove,
    closeModalReject,
    openModalReject,
    closeModalLoading,
    openModalLoading,
    closeModalResetPassword,
    openModalResetPassword
  }
}
