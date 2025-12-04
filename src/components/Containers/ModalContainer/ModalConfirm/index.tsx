import { useCallback, useMemo } from 'react'
import ModalContainer from '..'
import variableStyles from '../../../../enums/variables.style'
import ModalFooterContainer from '../../ModalFooterContainer'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'

export interface Props {
  confirmMessage?: string
  recordModal?: any
  handleCancel: (agrs?: any) => void
  handleConfirm: (agrs?: any) => void
  isLoading: boolean
}

const ModalConfirm = ({
  recordModal,
  handleCancel,
  isLoading = false,
  handleConfirm,
  confirmMessage = 'Are you sure for cancel current action ?'
}: Props) => {
  const handleConfirmOk = useCallback(() => {
    recordModal && handleConfirm(recordModal)
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
      title={confirmMessage}
      footer={footer}
      onCancel={handleCancel}
      width={variableStyles.modalWidth_short}
      isLoading={isLoading}
    ></ModalContainer>
  )
}

export default ModalConfirm
