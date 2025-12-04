import { Row, Space } from 'antd'

const ModalFooterContainer = ({ array }: { array: Array<any> }) => {
  return (
    <div className='modal-footer-container'>
      <Row justify='space-between'>
        {array.length === 1 ? (
          <>
            <Space key='0'>
              <div />
            </Space>
            <Space key='1'>{array[0]}</Space>
          </>
        ) : (
          array.map((item, index) => <Space key={index}>{item}</Space>)
        )}
      </Row>
    </div>
  )
}

export default ModalFooterContainer
