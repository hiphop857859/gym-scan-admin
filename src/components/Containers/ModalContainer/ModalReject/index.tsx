import { Form } from 'antd'
import { useCallback, useMemo } from 'react'
import ModalContainer from '..'
import variableStyles from '../../../../enums/variables.style'
import ModalFooterContainer from '../../ModalFooterContainer'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import TextArea from 'src/components/Atomic/Form/TextArea'

export interface Props {
  handleCancel: (agrs?: any) => void
  handleConfirm: (agrs?: any) => void
  isLoading: boolean
  id: boolean | number | string | Array<boolean | number | string | { id: number }>
  title?: string
}

const OpModalReject = ({ handleCancel, isLoading = false, handleConfirm, id, title = 'Reject' }: Props) => {
  const [form] = Form.useForm()

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((value) => {
        handleConfirm({ reject: { id, ...value } })
      })
      .catch((error) => {
        console.log(error)
      })
  }, [form, handleConfirm, id])

  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel onClick={handleCancel} />
            <ButtonConfirm isLoading={isLoading} onClick={handleSubmit} />
          </>
        ]}
      />
    ),
    [handleCancel, handleSubmit, isLoading]
  )

  return (
    <ModalContainer
      title={title}
      footer={footer}
      onCancel={handleCancel}
      width={variableStyles.modalWidth_short}
      isLoading={isLoading}
    >
      <Form layout='vertical' name='formReject' form={form}>
        <div>
          <Form.Item
            rules={[
              {
                required: true
              }
            ]}
            name={'reasonReject'}
          >
            <TextArea placeholder='enter reason reject for this record' />
          </Form.Item>
        </div>
      </Form>
    </ModalContainer>
  )
}

export default OpModalReject
