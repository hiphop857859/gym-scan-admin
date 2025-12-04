import { useCallback, useMemo } from 'react'
import ModalContainer from '..'
import variableStyles from '../../../../enums/variables.style'
import ModalFooterContainer from '../../ModalFooterContainer'
import { recordModal } from 'src/store/modal.store'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'

export interface Props {
  handleCancel: (agrs?: any) => void
  handleConfirm: (agrs?: any) => void
  recordModal?: recordModal
  isLoading: boolean
}

const OpModalResetPassword = ({ handleCancel, isLoading = false, handleConfirm, recordModal }: Props) => {
  const handleConfirmOk = useCallback(() => {
    recordModal && handleConfirm(recordModal.id)
  }, [handleConfirm, recordModal])
  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel onClick={handleCancel} />
            <ButtonConfirm isLoading={isLoading} onClick={handleConfirmOk} />
          </>
        ]}
      />
    ),
    [handleCancel, handleConfirmOk, isLoading]
  )

  return (
    <ModalContainer
      title={'Confirm Reset Password'}
      footer={footer}
      onCancel={handleCancel}
      width={variableStyles.modalWidth_short}
      isLoading={isLoading}
    >
      <div style={{ padding: '12px 0' }}>
        <p>Please confirm you want to reset the password for this user:</p>

        <div style={{ marginTop: 12, fontWeight: 500 }}>
          <div><strong>Name:</strong> {recordModal?.name}</div>
          <div><strong>Email:</strong> {recordModal?.email}</div>
        </div>
      </div>
    </ModalContainer>
  )
}

export default OpModalResetPassword
