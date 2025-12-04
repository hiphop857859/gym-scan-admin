import { useCallback, useMemo } from 'react'
import ModalContainer from '..'
import variableStyles from '../../../../enums/variables.style'
import ModalFooterContainer from '../../ModalFooterContainer'
import { recordModal } from 'src/store/modal.store'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonBanned from 'src/components/Atomic/Button/ButtonBanned'

export interface Props {
  handleCancel: (agrs?: any) => void
  handleConfirm: (agrs?: any) => void
  recordModal?: recordModal
  isLoading: boolean
}

const OpenModalBanned = ({ handleCancel, isLoading = false, handleConfirm, recordModal }: Props) => {
  const handleConfirmOk = useCallback(() => {
    recordModal && handleConfirm(recordModal)
  }, [handleConfirm, recordModal])
  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel onClick={handleCancel} />
            <ButtonBanned isLoading={isLoading} onClick={handleConfirmOk} />
          </>
        ]}
      />
    ),
    [handleCancel, handleConfirmOk, isLoading]
  )

  return (
    <ModalContainer
      title={'Are you sure this account is banned?'}
      footer={footer}
      onCancel={handleCancel}
      width={variableStyles.modalWidth_short}
      isLoading={isLoading}
    ></ModalContainer>
  )
}

export default OpenModalBanned
