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
  isLoading: boolean
  record?: recordModal
  title?: string
  message?: string
}

const ModalApprove = ({ handleCancel, isLoading = false, handleConfirm, record, title, message }: Props) => {
  const handelApproveOk = useCallback(() => {
    record && handleConfirm(record)
  }, [handleConfirm, record])

  const _title = useMemo(() => {
    return title || 'APPROVE'
  }, [title])

  const _message = useMemo(() => {
    return message || 'Are you sure for APPROVE for this record?'
  }, [message])

  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel onClick={handleCancel} />
            <ButtonConfirm isLoading={isLoading} onClick={handelApproveOk} />
          </>
        ]}
      />
    ),
    [handelApproveOk, handleCancel, isLoading]
  )

  return (
    <ModalContainer
      title={_title}
      footer={footer}
      onCancel={handleCancel}
      width={variableStyles.modalWidth_short}
      isLoading={isLoading}
    >
      {_message}
    </ModalContainer>
  )
}

export default ModalApprove
