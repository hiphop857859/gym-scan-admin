import { QuestionCircleTwoTone, UploadOutlined } from '@ant-design/icons'
import { Button, Image, Modal, Tooltip } from 'antd'
import Upload, { UploadFile, UploadProps } from 'antd/es/upload'
import { useState } from 'react'
import { Pick } from '../../../helpers/lodash'
import { UploadListType } from 'antd/es/upload/interface'
import { toast } from 'react-toastify'
import { acceptedFiles, acceptedImageTypes, convertMB, imageAccepted, maxSizeFile } from 'src/constants/file'

export interface UploadImageType {
  onChange?: (...args: any[]) => void
  accepts: Array<imageAccepted>
  listType?: UploadListType
  value?: File | string
}
const UploadFileImage = ({ onChange, accepts, value }: UploadImageType) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [file, setFile] = useState<UploadFile | null>()
  const [url, setUrl] = useState<string>()

  let propsUrl = value && (value as any).url

  if (typeof value === 'string') {
    propsUrl = value
  }

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      try {
        file.preview = URL.createObjectURL(file.originFileObj as Blob)
      } catch (error) {
        console.log(error)
        /* empty */
      }
    }

    setPreviewImage(file.url || (file.preview as string) || propsUrl)
    setPreviewOpen(true)
    setPreviewTitle((value as File)?.name || file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))

    setUrl(file.preview || propsUrl)
  }

  const beforeUpload: UploadProps['beforeUpload'] = ({ size, type }) => {
    if (!Object.values(Pick(acceptedFiles, accepts)).includes(type)) {
      toast.error(`Only support file type : ${Object.keys(Pick(acceptedFiles, accepts))}`)
      return
    }

    if (size > maxSizeFile) {
      toast.error(`Maximum file size : ${convertMB(maxSizeFile)} MB , your file size : ${convertMB(size)} MB `)
      return
    }

    return false
  }

  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (!file.status) {
      setFile(file)
      onChange && onChange(file)
    }
    if (file.status === 'uploading') {
      setFile(file)
    }
  }

  const handleRemove: UploadProps['onRemove'] = () => {
    setFile(null)
    onChange && onChange(null)
    URL.revokeObjectURL(url ? url : '')
  }

  return (
    <>
      <Upload
        accept={Object.keys(Pick(acceptedFiles, accepts)).toString()}
        beforeUpload={beforeUpload}
        listType={'picture'}
        defaultFileList={
          propsUrl
            ? [
                {
                  uid: propsUrl,
                  name: propsUrl,
                  status: 'done',
                  url: propsUrl
                }
              ]
            : (value as File) && [
                {
                  uid: (value as File).name,
                  name: (value as File).name,
                  status: 'done',
                  url: value ? (value as any).url : value
                }
              ]
        }
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {file || propsUrl ? null : (
          <Button type='dashed' icon={<UploadOutlined />}>
            Upload
          </Button>
        )}
        <Tooltip title={`Only support file type : ${Object.keys(Pick(acceptedFiles, accepts))}`}>
          <QuestionCircleTwoTone className='ml-2' />
        </Tooltip>
      </Upload>

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        {previewImage && (
          <Image
            preview={false}
            wrapperStyle={{ width: '100%' }}
            alt='imaged'
            style={{ width: '100%' }}
            src={previewImage}
          />
        )}
      </Modal>
    </>
  )
}

export default UploadFileImage
