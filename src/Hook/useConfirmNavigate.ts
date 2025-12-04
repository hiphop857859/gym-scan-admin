import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModals } from './useModalStore'

export const useConfirmNavigate = (to: string = '/account-connected', confirmMessage?: string) => {
  const navigate = useNavigate()
  const { openModalConfirmOut } = useModals({
    handleModalConfirmOutOk: (_record, close) => {
      close && close()
      navigate(to)
    }
  })

  const confirmAndNavigate = useCallback(() => {
    openModalConfirmOut('confirm', confirmMessage)
  }, [openModalConfirmOut, confirmMessage])

  return { confirmAndNavigate }
}
