import React, { memo } from 'react'
import { Modal } from 'antd'
import Spin from 'src/components/Atomic/Spin/Spin'

export type Props = {
  destroyOnClose?: boolean
  isLoading?: boolean
  onCancel?: (...args: any[]) => void
  children?: React.ReactNode
  footer?: React.ReactNode
  title?: string
  width?: number
  zIndex?: number
  open?: boolean
  afterClose?: () => void
  bodyStyle?: React.CSSProperties
}

const ModalContainer = ({ destroyOnClose = true, isLoading = false, children, open = true, ...resetProps }: Props) => (
  <Modal
    {...resetProps}
    destroyOnClose={destroyOnClose}
    maskClosable={false}
    style={{ margin: '30px 0' }}
    centered
    open={open}
  >
    <Spin spinning={isLoading}>{children}</Spin>
  </Modal>
)

export default memo(ModalContainer)
