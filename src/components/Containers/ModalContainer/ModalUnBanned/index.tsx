import { useCallback, useMemo } from 'react'
import ModalContainer from '..'
import variableStyles from '../../../../enums/variables.style'
import ModalFooterContainer from '../../ModalFooterContainer'
import { recordModal } from 'src/store/modal.store'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonUnBanned from 'src/components/Atomic/Button/ButtonUnBanned'

export interface Props {
  handleCancel: (args?: any) => void
  handleConfirm: (args?: any) => void
  recordModal?: recordModal
  isLoading: boolean
}

const OpenModalUnBanned = ({ handleCancel, handleConfirm, recordModal, isLoading = false }: Props) => {
  const handleConfirmOk = useCallback(() => {
    if (recordModal) {
      handleConfirm(recordModal)
    }
  }, [handleConfirm, recordModal])

  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel onClick={handleCancel} />
            <ButtonUnBanned isLoading={isLoading} onClick={handleConfirmOk} />
          </>
        ]}
      />
    ),
    [handleCancel, handleConfirmOk, isLoading]
  )

  return (
    <ModalContainer
      title="Unban Account"
      footer={footer}
      onCancel={handleCancel}
      width={variableStyles.modalWidth_short}
      isLoading={isLoading}
    >
      <p className="text-gray-700 dark:text-gray-300 text-center py-4">
        Are you sure you want to <span className="font-semibold text-green-600">unban</span> this account?
        <br />
        The user will regain access to their account immediately.
      </p>
    </ModalContainer>
  )
}

export default OpenModalUnBanned
