import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Image, Modal, Tooltip } from 'antd'
import Upload, { UploadFile, UploadProps } from 'antd/es/upload'
import React, { useState } from 'react'
import {
  acceptedFiles as accepted,
  acceptedFilesType,
  // acceptedImageTypes,
  convertMB,
  maxSizeFile
} from 'src/constants/file'
import { Pick } from '../../../helpers/lodash'
import { UploadListType } from 'antd/es/upload/interface'
import { toast } from 'react-toastify'

export interface UploadImgaeType {
  onChange?: (...args: any[]) => void
  accepts: Array<acceptedFilesType>
  listType?: UploadListType
  value?: File | string | UploadFile<any>[]
  style?: React.CSSProperties
  customRequest?: UploadProps['customRequest']
  maxCount?: number
  disabled?: boolean
}
const InputImageList = ({
  onChange,
  accepts,
  style,
  value,
  customRequest,
  maxCount = undefined,
  disabled = false
}: UploadImgaeType) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList] = useState<UploadFile[]>([])
  const [url, setUrl] = useState<string>()

  const propsUrl = typeof (value as File)?.name === 'string' && value ? URL.createObjectURL(value as File) : ''

  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj as Blob)
    }

    setPreviewImage(file.url || (file.preview as string) || propsUrl)
    setPreviewOpen(true)
    setPreviewTitle((value as File)?.name || file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))

    setUrl(file.preview || propsUrl)
  }

  const beforeUpload: UploadProps['beforeUpload'] = ({ size, type }, newFileList) => {
    if (maxCount && Array.isArray(value)) {
      if (newFileList.length + value.length > maxCount) {
        toast.error(`You can only upload up to ${maxCount} files.`)
        return Upload.LIST_IGNORE // Prevents the file from being added to the list
      }
    }

    if (!Object.values(Pick(accepted, accepts)).includes(type)) {
      toast.error(`Only support file type : ${Object.keys(Pick(accepted, accepts))}`)
      return
    }

    if (size > maxSizeFile) {
      toast.error(`Maximum file size : ${convertMB(maxSizeFile)} MB , your file size : ${convertMB(size)} MB `)
      return
    }

    return customRequest ? true : false
  }

  const handleChange: UploadProps['onChange'] = ({ fileList }) =>
    // setFileList(fileList);
    onChange && onChange(fileList)

  const handleRemove: UploadProps['onRemove'] = () => {
    // setFileList(fileList.filter(item=>item.uid === file.uid));
    onChange && onChange([])
    URL.revokeObjectURL(url ? url : '')
  }

  return (
    <>
      <Upload
        customRequest={customRequest}
        accept={Object.keys(Pick(accepted, accepts)).toString()}
        beforeUpload={beforeUpload}
        listType={'picture-card'}
        fileList={value as UploadFile<any>[]}
        multiple
        style={style}
        disabled={disabled}
        maxCount={maxCount}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {fileList || propsUrl ? null : <Button icon={<UploadOutlined />}>Upload</Button>}
        <Tooltip
          title={`Only support file type : ${Object.keys(Pick(accepted, accepts))} , 
         Maximum file size : ${convertMB(maxSizeFile)} MB`}
        >
          <CloudUploadOutlined style={{ color: 'blue', fontSize: '26px' }} color={'blue'} />
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

        {typeof value !== 'string' && propsUrl && !fileList && (
          <Image preview={false} alt='imaged' style={{ width: '100%' }} src={propsUrl} />
        )}
      </Modal>
    </>
  )
}

export default InputImageList
