import { Form, Empty, Input } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import TextInput from 'src/components/Atomic/Form/TextInput'
import DatePicker from 'src/components/Atomic/Custom/DatePicker'
import InputImageList from 'src/components/Atomic/Form/InputImageList'
import Select from 'src/components/Atomic/Form/Select'
import ModalContainer from 'src/components/Containers/ModalContainer'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import variableStyles from 'src/enums/variables.style'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { Artist } from 'src/services/artists/types'
import { acceptedImageTypes, imageAccepted } from 'src/constants/file'
import { uploadImage } from 'src/services/upload/service'
import { UploadTypes, UploadStatus } from 'src/services/upload'
import Spin from 'src/components/Atomic/Spin/Spin'
import { useSearch } from 'src/Hook/useSearch'
import dayjs, { formatTimeStartOfDate } from 'src/helpers/time'
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons'
import { useImageHandler, type ImageWithOriginal } from 'src/Hook/useImageHandler'
import { ArtistType } from '../Columns'

type SocialMediaName = 'facebook' | 'instagram' | 'youtube' | 'twitter'

const SOCIAL_NETWORKS: Array<{ name: SocialMediaName; icon: JSX.Element }> = [
  { name: 'facebook', icon: <FacebookOutlined className='center-icon' /> },
  { name: 'instagram', icon: <InstagramOutlined className='center-icon' /> },
  { name: 'youtube', icon: <YoutubeOutlined className='center-icon' /> },
  { name: 'twitter', icon: <TwitterOutlined className='center-icon' /> }
]

const urlRules = {
  pattern: /^(https?:\/\/[^\s,]+)(,\s*https?:\/\/[^\s,]+)*$/,
  message: 'Please enter a valid YouTube URL'
}

interface SocialMedia {
  facebookName: string
  facebookUrl: string
  instagramName: string
  instagramUrl: string
  youtubeName: string
  youtubeUrl: string
  twitterName: string
  twitterUrl: string
}
interface ArtistForm extends Artist, SocialMedia {}

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: null | string
  open: boolean
  afterClose?: () => void
}

const MAX_UPLOAD = 5

const ModalDetail = ({ handleCancel, modalDetailId, handleOk, open, afterClose = undefined }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm<Partial<Omit<Artist, 'dateOfBirth'> & { dateOfBirth: dayjs.Dayjs }>>()
  const isNew = !modalDetailId
  const [originalImages, setOriginalImages] = useState<{ id: string; image: string }[]>([])
  const titleModal = isNew ? 'Create new artist' : 'Artist detail'
  const { isFormDirty } = useDirtyForm(form)
  const { showSuccess } = useToast()
  const { getNewImages, handleNewImages, handleExistingImages, imagesValidator } = useImageHandler()
  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createArtist, loading: loadingCreate } = useQuery({
    func: Service.createArtist,
    onSuccess: () => {
      showSuccess('Create artist success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const { fetch: updateArtist, loading: loadingUpdate } = useQuery({
    func: Service.updateArtist,
    onSuccess: () => {
      showSuccess('update artist success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const {
    triggerSearch: triggerSearchMusicStyles,
    results: musicStyles,
    loading: musicStylesLoading,
    setResults: setMusicStylesResults
  } = useSearch({
    func: Service.getEventsMusicStyles,
    normalizationData: (_, data: Record<string, any>[]) => [...data]
  })

  const onSearchMusicStyles = (q: string) => {
    return triggerSearchMusicStyles({ q })
  }

  const customRequest = async (options: any) => {
    const { file, onSuccess = () => {}, onError = () => {}, onProgress = () => {} } = options || {}
    try {
      const key = await uploadImage({
        file,
        type: UploadTypes.ARTIST
      })
      if (key) {
        onProgress({ percent: 100 })
        onSuccess({ key }, file)

        return
      }

      throw new Error('Uploading image failed')
    } catch (error) {
      onError(error as Error)
    }
  }

  const { loading: loadingDetail } = useQuery({
    func: Service.getArtist,
    isQuery: !isNew,
    options: {
      noCache: true
    },
    params: {
      id: modalDetailId?.toString?.() || ''
    },
    onSuccess: (_value) => {
      setMusicStylesResults(_value.musicStyles)
      setOriginalImages(_value.images || [])
      form.setFieldsValue({
        name: _value.name,
        dateOfBirth: _value.dateOfBirth ? dayjs.utc(_value.dateOfBirth).local() : undefined,
        placeOfBirth: _value.placeOfBirth,
        occupation: _value.occupation,
        description: _value.description,
        type: _value.type,
        musicStyleIds: _value.musicStyles.map((style) => style.id),
        imageKeys: _value.images.map((image) => ({
          uid: image.id,
          url: image.image,
          status: UploadStatus.DONE,
          isOriginal: true,
          name: 'Preview'
        })),
        ...Object.entries(SOCIAL_NETWORKS).reduce((acc, [, { name }]) => {
          const data = _value.socialMedia?.[name as SocialMediaName]

          return {
            ...acc,
            [`${name}Name`]: data?.name,
            [`${name}Url`]: data?.url
          }
        }, {})
      })
    }
  })

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values: any) => {
        setIsLoading(true)
        const { imageKeys, ...restValues } = values

        // Handle images
        const newImages = getNewImages(imageKeys as ImageWithOriginal[] | undefined)
        const imagesData = isNew
          ? handleNewImages(newImages)
          : handleExistingImages(imageKeys as ImageWithOriginal[] | undefined, originalImages || [], newImages)

        const newValues = {
          ...restValues,
          ...imagesData,
          dateOfBirth: values.dateOfBirth && formatTimeStartOfDate(values.dateOfBirth),
          socialMedia: Object.fromEntries(
            SOCIAL_NETWORKS.map(({ name }) => {
              const socialName = values[`${name}Name` as keyof ArtistForm] as string
              const socialUrl = values[`${name}Url` as keyof ArtistForm] as string

              return socialName && socialUrl
                ? [
                    name,
                    {
                      name: socialName || '',
                      url: socialUrl || ''
                    }
                  ]
                : []
            }).filter((entry) => entry.length)
          )
        }

        if (isNew) {
          createArtist(newValues)
        } else {
          updateArtist({ payload: newValues, vars: { id: modalDetailId } })
        }
      })
      .catch(() => {})
  }, [
    form,
    getNewImages,
    isNew,
    handleNewImages,
    handleExistingImages,
    originalImages,
    createArtist,
    updateArtist,
    modalDetailId
  ])

  const loading = loadingCreate || loadingDetail || loadingUpdate || isLoading

  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel isModal={isFormDirty} onClick={handleCancel} />
            <ButtonConfirm disabled={!isFormDirty} isLoading={loading} onClick={handleSubmit} />
          </>
        ]}
      />
    ),
    [handleCancel, handleSubmit, isFormDirty, loading]
  )

  return (
    <>
      <ModalContainer
        title={titleModal}
        footer={footer}
        onCancel={handleCancel}
        width={variableStyles.modalWidth_normal}
        isLoading={loading}
        destroyOnClose={true}
        open={open}
        afterClose={afterClose}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <>
          <Form layout='vertical' className='grid grid-cols-1 gap-1 mr-2' autoComplete='off' form={form}>
            <Form.Item name={'name'} rules={[{ required: true, type: 'string' }]} label='Name'>
              <TextInput placeholder='Name' />
            </Form.Item>
            <Form.Item name={'dateOfBirth'} rules={[{ type: 'date' }]} label='Date of birth'>
              <DatePicker placeholder='Date of birth' />
            </Form.Item>
            <Form.Item name={'placeOfBirth'} rules={[{ type: 'string' }]} label='Place of birth'>
              <TextInput placeholder='Place of birth' />
            </Form.Item>
            <Form.Item name={'occupation'} rules={[{ required: true, type: 'string' }]} label='Short Bio'>
              <TextInput placeholder='Short Bio' />
            </Form.Item>
            <Form.Item name={'type'} rules={[{ required: true, type: 'string' }]} label='Type'>
              <Select
                placeholder='Type'
                data={Object.values(ArtistType).map((type) => ({
                  id: type,
                  name: type,
                  code: type
                }))}
                keyItem='id'
                valueItem='id'
                className='h-full w-[200px]'
              />
            </Form.Item>
            <Form.Item name={'description'} rules={[{ required: true, type: 'string' }]} label='Long Bio'>
              <Input.TextArea placeholder='Long Bio' rows={4} />
            </Form.Item>
            <Form.Item
              name={'imageKeys'}
              validateTrigger={[]}
              rules={[
                {
                  validator: imagesValidator,
                  required: true
                }
              ]}
              label='Images (Maximum 5 images)'
            >
              <InputImageList
                customRequest={customRequest}
                listType='picture-circle'
                maxCount={MAX_UPLOAD}
                accepts={Object.keys(acceptedImageTypes) as Array<imageAccepted>}
              />
            </Form.Item>
            <Form.Item name={'musicStyleIds'} rules={[{ required: true }]} label='Music styles' className='mb-0'>
              <Select
                mode='multiple'
                tokenSeparators={[',']}
                onSearch={onSearchMusicStyles}
                onDropdownVisibleChange={(isOpen) => {
                  isOpen && musicStyles ? onSearchMusicStyles('') : () => {}
                }}
                isLoading={musicStylesLoading}
                notFoundContent={
                  musicStylesLoading ? (
                    // eslint-disable-next-line react/no-children-prop
                    <Spin spinning={musicStylesLoading} children={<div>loading</div>} />
                  ) : (
                    <Empty />
                  )
                }
                data={
                  musicStyles.map((style) => ({
                    id: style.id,
                    name: style.name,
                    code: style.id
                  })) ?? []
                }
              />
            </Form.Item>
            <div className='flex flex-col gap-4 w-full mt-4'>
              <div>Social network</div>
              {SOCIAL_NETWORKS.map(({ name, icon }) => (
                <div key={name} className='flex gap-2 w-full'>
                  {icon}
                  <Form.Item name={`${name}Name`}>
                    <TextInput
                      placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} Name`}
                      className='w-full lg:min-w-[24em] sm:min-w-[100px]'
                    />
                  </Form.Item>
                  <Form.Item
                    name={`${name}Url`}
                    dependencies={[`${name}Name`]}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const socialName = getFieldValue(`${name}Name`)
                          if ((socialName && !value) || (!socialName && value)) {
                            return Promise.reject(new Error('Both name and URL must be filled or both empty.'))
                          }
                          return Promise.resolve()
                        }
                      }),
                      {
                        pattern: urlRules.pattern,
                        message: `Please enter a valid ${name.charAt(0).toUpperCase() + name.slice(1)} URL`
                      }
                    ]}
                  >
                    <TextInput
                      placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} Url`}
                      className='w-full lg:min-w-[24em] sm:min-w-[100px]'
                    />
                  </Form.Item>
                </div>
              ))}
            </div>
          </Form>
        </>
      </ModalContainer>
    </>
  )
}

export default ModalDetail
