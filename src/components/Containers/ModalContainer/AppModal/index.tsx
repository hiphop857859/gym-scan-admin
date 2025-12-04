import { useModalStore } from 'src/store/modal.store'
import OpModalConfirm from '../ModalConfirm'
import OpModalDelete from '../ModalDelete'
import OpenModalBanned from '../ModalBanned'

import ModalApprove from '../ModalApprove'
import ModalReject from '../ModalReject'
import OpenModalUnBanned from '../ModalUnBanned'
import OpModalResetPassword from '../ModalResetPassword'

const AppModal = () => {
  const [
    {
      handleModalConfirmOutCancel,
      handleModalConfirmOutOk,
      handleModalDeleteCancel,
      handleModalDeleteOk,
      handleModalApproveCancel,
      handleModalApproveOk,
      handleModalBannedCancel,
      handleModalUnBannedCancel,
      handleModalUnBannedOk,
      handleModalResetPasswordCancel,
      handleModalResetPasswordOk,
      handleModalBannedOk,
      isLoading,
      recordModalConfirmOut,
      recordModalDelete,
      recordModalApprove,
      recordModalReject,
      recordModalBanned,
      recordModalUnBanned,
      recordModalResetPassword,
      handleModalRejectOk,
      handleModalRejectCancel,
      rejectMessage = 'Are you sure for REJECT for this record?',
      approveMessage = 'Are you sure for APPROVE for this record?',
      confirmMessage = 'Are you sure for cancel current action ?',
      needRejectReason
    }
  ] = useModalStore()
  return (
    <>
      {!!recordModalDelete && (
        <OpModalDelete
          recordModal={recordModalDelete}
          handleCancel={handleModalDeleteCancel}
          handleConfirm={handleModalDeleteOk}
          isLoading={isLoading}
        />
      )}
      {!!recordModalResetPassword && (
        <OpModalResetPassword
          recordModal={recordModalResetPassword}
          handleCancel={handleModalResetPasswordCancel}
          handleConfirm={handleModalResetPasswordOk}
          isLoading={isLoading}
        />
      )}
      {!!recordModalBanned && (
        <OpenModalBanned
          recordModal={recordModalBanned}
          handleCancel={handleModalBannedCancel}
          handleConfirm={handleModalBannedOk}
          isLoading={isLoading}
        />
      )}

      {!!recordModalUnBanned && (
        <OpenModalUnBanned
          recordModal={recordModalUnBanned}
          handleCancel={handleModalUnBannedCancel}
          handleConfirm={handleModalUnBannedOk}
          isLoading={isLoading}
        />
      )}

      {!!recordModalConfirmOut && (
        <OpModalConfirm
          confirmMessage={confirmMessage}
          recordModal={recordModalConfirmOut}
          handleCancel={handleModalConfirmOutCancel}
          handleConfirm={handleModalConfirmOutOk}
          isLoading={isLoading}
        />
      )}

      {!!recordModalApprove && (
        <ModalApprove
          message={approveMessage}
          isLoading={isLoading}
          handleCancel={handleModalApproveCancel}
          handleConfirm={handleModalApproveOk}
          record={recordModalApprove}
        />
      )}
      {!!recordModalReject && needRejectReason && (
        <ModalReject
          title={rejectMessage}
          isLoading={isLoading}
          handleCancel={handleModalRejectCancel}
          handleConfirm={handleModalRejectOk}
          id={recordModalReject as string}
        />
      )}

      {!!recordModalReject && !needRejectReason && (
        <ModalApprove
          title={'REJECT'}
          isLoading={isLoading}
          message={rejectMessage}
          handleCancel={handleModalRejectCancel}
          handleConfirm={handleModalRejectOk}
          record={recordModalReject}
        />
      )}

      {/* {!!recordModalLoading && <OpModalLoading record={recordModalLoading} />} */}
    </>
  )
}

export default AppModal
