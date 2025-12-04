import { Button, Checkbox, Empty, Form, message, Spin, Upload, UploadFile, UploadProps } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import UploadFileImage from 'src/components/Atomic/Form/InputImage'
import TextInput from 'src/components/Atomic/Form/TextInput'
import ModalContainer from 'src/components/Containers/ModalContainer'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import { acceptedImageTypes, acceptedVideoTypes, imageAccepted } from 'src/constants/file'
import variableStyles from 'src/enums/variables.style'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { UploadStatus, UploadTypes } from 'src/services/upload/types'
import { checkIsFormError, getSingerErrorMessage } from 'src/helpers/ultils'
import Select from 'src/components/Atomic/Form/Select'
import { OperationalScope, PartnerPayload } from 'src/services/partner'
import TextArea from 'src/components/Atomic/Form/TextArea'

import {
  FacebookOutlined,
  InstagramOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  TwitterOutlined,
  UploadOutlined,
  YoutubeOutlined
} from '@ant-design/icons'
import { useSearch } from 'src/Hook/useSearch'
import { EventsCategoriesResponseList, SocialMedia } from 'src/services/events'
import { OriginalImage } from 'src/Hook/useImageHandler'
import { uploadImage, uploadVideo } from 'src/services/upload/service'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: boolean | string
}

interface PartnerPayloadForm extends Omit<PartnerPayload, 'logo' | 'banner'> {
  facebookName: string
  facebookUrl: string
  instagramName: string
  instagramUrl: string
  youtubeName: string
  youtubeUrl: string
  twitterName: string
  twitterUrl: string
  logo: OriginalImage | File
  banner: OriginalImage | File
}
type SocialMediaName = 'facebook' | 'instagram' | 'youtube' | 'twitter'

const SOCIAL_NETWORKS: Array<{ name: SocialMediaName; icon: JSX.Element }> = [
  { name: 'facebook', icon: <FacebookOutlined className='center-icon' /> },
  { name: 'instagram', icon: <InstagramOutlined className='center-icon' /> },
  { name: 'youtube', icon: <YoutubeOutlined className='center-icon' /> },
  { name: 'twitter', icon: <TwitterOutlined className='center-icon' /> }
]

const urlRules = {
  pattern: /^(https?:\/\/[^\s,]+)(,\s*https?:\/\/[^\s,]+)*$/
}
const MAX_UPLOAD = 5

const ModalDetail = ({ handleCancel, modalDetailId, handleOk }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isUpdate, setIsUpdate] = useState(false)
  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList((pre) => {
        // Limit the number of uploaded files
        // get Max upload newest
        const newFiles = pre.length >= MAX_UPLOAD ? pre.slice(pre.length - (MAX_UPLOAD - 1)) : pre
        return [...newFiles, file]
      })

      return false
    },
    fileList,
    listType: 'text',
    multiple: true,
    accept: Object.keys({
      ...acceptedImageTypes,
      ...acceptedVideoTypes
    }).join(','),
    maxCount: MAX_UPLOAD,
    defaultFileList: []
  }

  const [form] = Form.useForm<PartnerPayloadForm>()
  const isNew = typeof modalDetailId === 'boolean'

  const titleModal = isNew ? 'Create new partner' : 'Partner detail'

  const { isFormDirty } = useDirtyForm(form)

  const { showSuccess } = useToast()

  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createPartner, loading: loadingCreate } = useQuery({
    func: Service.createPartner,
    onSuccess: () => {
      showSuccess('Create partner success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const { fetch: updatePartner, loading: loadingUpdate } = useQuery({
    func: Service.updatePartner,
    onSuccess: () => {
      showSuccess('update partner success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const { loading: loadingDetail } = useQuery({
    func: Service.getPartner,
    isQuery: !isNew,
    options: {
      noCache: true
    },
    params: {
      id: modalDetailId.toString()
    },
    onSuccess: (_value) => {
      setIsUpdate(true)
      const socialMedia = _value.socialMediaLinks as SocialMedia | undefined
      form.setFieldsValue({
        ..._value,
        operationalScope: _value.operationalScope as OperationalScope,
        categoryIds: _value.categories?.map((c) => c.category.id) ?? [],
        ...Object.entries(SOCIAL_NETWORKS).reduce(
          (acc, [, { name }]) => ({
            ...acc,
            [`${name}Name`]: socialMedia?.[name as keyof SocialMedia]?.name || '',
            [`${name}Url`]: socialMedia?.[name as keyof SocialMedia]?.url || ''
          }),
          {}
        ),
        logo: {
          uid: _value.logoUrl,
          url: _value.logoUrl,
          status: UploadStatus.DONE,
          isOriginal: true,
          name: 'Preview'
        },
        banner: {
          uid: _value.bannerUrl,
          url: _value.bannerUrl,
          status: UploadStatus.DONE,
          isOriginal: true,
          name: 'Preview'
        }
      })
      setFileList(
        _value.mediaGalleryUrls.map((url, index) => ({
          uid: url + index,
          name: url.split('/').pop()?.split('?')?.[0] || 'Preview',
          status: UploadStatus.DONE,
          isOriginal: true,
          url
        }))
      )
      setResultsCategories(_value.categories.map((item) => item.category) ?? [])
    }
  })

  const {
    triggerSearch: triggerSearchCategory,
    results: category,
    loading: categoryLoading,
    setResults: setResultsCategories
  } = useSearch({
    func: Service.getEventsCategories,
    normalizationData: (_, data: EventsCategoriesResponseList): EventsCategoriesResponseList => [...data]
  })

  const onSearchCategory = (q: string) => {
    return triggerSearchCategory({ q })
  }

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values) => {
        setIsLoading(true)
        // Prepare social media data
        const socialMedia = SOCIAL_NETWORKS.reduce<SocialMedia>((acc, { name }) => {
          const socialName = values[`${name}Name` as keyof PartnerPayload] as string
          const socialUrl = values[`${name}Url` as keyof PartnerPayload] as string

          if (socialName && socialUrl) {
            acc[name as keyof SocialMedia] = { name: socialName, url: socialUrl }
          }
          return acc
        }, {})
        if (isNew) {
          const imageKeyLogo = await uploadImage({
            file: values.logo as unknown as File,
            type: UploadTypes.PARTNER
          })
          const imageKeyBanner = await uploadImage({
            file: values.banner as unknown as File,
            type: UploadTypes.PARTNER
          })

          const mediaGalleries = [] as string[]
          for (const file of fileList) {
            // if (!(file as OriginalImage).isOriginal) {
            if (Object.values(acceptedImageTypes).includes((file as any).type)) {
              const imageKey = await uploadImage({
                file: file as unknown as File,
                type: UploadTypes.PARTNER
              })
              if (imageKey) {
                mediaGalleries.push(imageKey)
              } else {
                throw new Error('Upload failed')
              }
            } else {
              const videoKey = await uploadVideo({
                file: file as unknown as File,
                type: UploadTypes.PARTNER
              })
              if (videoKey) {
                mediaGalleries.push(videoKey)
              } else {
                throw new Error('Upload failed')
              }
            }
          }
          if (!imageKeyLogo || !imageKeyBanner || mediaGalleries.length !== fileList.length) {
            throw new Error('Upload failed')
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { logo: _logo, banner: _banner, ...restValues } = values
          return await createPartner({
            ...restValues,
            logoUrl: imageKeyLogo,
            bannerUrl: imageKeyBanner,
            socialMediaLinks: socialMedia,
            mediaGalleryUrls: mediaGalleries
          })
        } else {
          if (!modalDetailId || typeof modalDetailId !== 'string') {
            message.error('Missing partner id')
            setIsLoading(false)
            return
          }
          let logoUrl: string | undefined
          let bannerUrl: string | undefined
          const updateValue = { ...values }
          if (values.logo && (values.logo as OriginalImage).isOriginal === false) {
            const imageKeyLogo = await uploadImage({
              file: values.logo as unknown as File,
              type: UploadTypes.PARTNER
            })
            if (imageKeyLogo) {
              logoUrl = imageKeyLogo
            } else {
              throw new Error('Upload failed')
            }
          }
          if (values.banner && (values.banner as OriginalImage).isOriginal === false) {
            const imageKeyBanner = await uploadImage({
              file: values.banner as unknown as File,
              type: UploadTypes.PARTNER
            })
            if (imageKeyBanner) {
              bannerUrl = imageKeyBanner
            } else {
              throw new Error('Upload failed')
            }
          }
          const mediaGalleries = [] as string[]
          for (const file of fileList) {
            if ((file as OriginalImage).isOriginal === false) {
              if (Object.values(acceptedImageTypes).includes((file as any).type)) {
                const imageKey = await uploadImage({
                  file: file as unknown as File,
                  type: UploadTypes.PARTNER
                })
                if (imageKey) {
                  mediaGalleries.push(imageKey)
                } else {
                  throw new Error('Upload failed')
                }
              } else {
                const videoKey = await uploadVideo({
                  file: file as unknown as File,
                  type: UploadTypes.PARTNER
                })
                if (videoKey) {
                  mediaGalleries.push(videoKey)
                } else {
                  throw new Error('Upload failed')
                }
              }
            } else {
              mediaGalleries.push((file as any).url)
            }
          }
          if (mediaGalleries.length !== fileList.length) {
            throw new Error('Upload failed')
          }
          /* eslint-disable @typescript-eslint/no-unused-vars */
          const {
            logo: _logo,
            banner: _banner,
            logoUrl: _logoUrl,
            bannerUrl: _bannerUrl,
            // mediaGalleries,
            ...restValues
          } = updateValue
          return await updatePartner({
            payload: {
              ...restValues,
              ...(logoUrl ? { logoUrl } : {}),
              ...(bannerUrl ? { bannerUrl } : {}),

              socialMediaLinks: socialMedia,
              mediaGalleryUrls: mediaGalleries
            },
            vars: { id: modalDetailId }
          })
          /* eslint-enable @typescript-eslint/no-unused-vars */
        }
      })
      .catch((error) => {
        if (checkIsFormError(error)) return Promise.reject(error)

        message.error(getSingerErrorMessage(error) || 'Failed to save partner')
        return Promise.reject(error)
      })
  }, [createPartner, fileList, form, isNew, modalDetailId, updatePartner])

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
      >
        <>
          <Form layout='vertical' className='grid grid-cols-1 gap-1' autoComplete='off' form={form}>
            {isNew && (
              <Form.Item name={'logo'} rules={[{ required: true }]} label='Logo'>
                <UploadFileImage
                  listType='picture-circle'
                  accepts={Object.keys(acceptedImageTypes) as Array<imageAccepted>}
                />
              </Form.Item>
            )}
            {isUpdate && (
              <Form.Item name={'logo'} rules={[{ required: true }]} label='Logo'>
                <UploadFileImage
                  listType='picture-circle'
                  accepts={Object.keys(acceptedImageTypes) as Array<imageAccepted>}
                />
              </Form.Item>
            )}
            {isNew && (
              <Form.Item name={'banner'} rules={[{ required: true }]} label='Banner'>
                <UploadFileImage
                  listType='picture-circle'
                  accepts={Object.keys(acceptedImageTypes) as Array<imageAccepted>}
                />
              </Form.Item>
            )}
            {isUpdate && (
              <Form.Item name={'banner'} rules={[{ required: true }]} label='Banner'>
                <UploadFileImage
                  listType='picture-circle'
                  accepts={Object.keys(acceptedImageTypes) as Array<imageAccepted>}
                />
              </Form.Item>
            )}
            <Form.Item name={'companyName'} rules={[{ required: true, type: 'string' }]} label='Company name'>
              <TextInput placeholder='Company name' />
            </Form.Item>
            <Form.Item name='categoryIds' label='Event Category' rules={[{ required: true }]}>
              <Select
                className='multiple'
                mode='multiple'
                tokenSeparators={[',']}
                placeholder='Event Category'
                onSearch={onSearchCategory}
                onDropdownVisibleChange={(isOpen) => {
                  isOpen && category ? onSearchCategory('') : () => {}
                }}
                isLoading={categoryLoading}
                notFoundContent={
                  categoryLoading ? (
                    // eslint-disable-next-line react/no-children-prop
                    <Spin spinning={categoryLoading} children={<div>loading</div>} />
                  ) : (
                    <Empty />
                  )
                }
                data={
                  category.map((c) => ({
                    id: c.id,
                    name: c.name,
                    code: c.id
                  })) ?? []
                }
              />
            </Form.Item>
            <Form.Item name={'companyBio'} rules={[{ required: true, type: 'string' }]} label='Company bio'>
              <TextArea placeholder='Company Bio' rows={4} />
            </Form.Item>
            <div className='grid grid-cols-2 gap-4'>
              <Form.Item name={'city'} rules={[{ required: true, type: 'string' }]} label='City'>
                <TextInput placeholder='City' />
              </Form.Item>
              <Form.Item
                name={'operationalScope'}
                rules={[{ required: true, type: 'string' }]}
                label='Operational scope'
              >
                <Select
                  placeholder='Type'
                  data={Object.values(OperationalScope).map((type) => ({
                    id: type,
                    name: type,
                    code: type
                  }))}
                  keyItem='id'
                  valueItem='id'
                  className='h-full w-[200px]'
                />
              </Form.Item>
              <Form.Item name={'contactEmail'} rules={[{ type: 'email' }, { required: true }]} label='Contact email'>
                <TextInput placeholder='Contact email' />
              </Form.Item>
              <Form.Item name={'contactPhoneNumber'} rules={[{ type: 'string' }]} label='Contact phone number'>
                <TextInput placeholder='Contact phone number' />
              </Form.Item>
              <Form.Item name={'languagesSpoken'} rules={[{ type: 'string' }]} label='Languages spoken'>
                <TextInput placeholder='Language spoken' />
              </Form.Item>
              <Form.Item name={'befestCertification'} label='Befest certification' valuePropName='checked'>
                <Checkbox />
              </Form.Item>
            </div>
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
            <div className='grid gap-2'>
              <div>Testimonials</div>
              <Form.List name='testimonials'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }: any) => (
                      <div key={key} className='ticket-entry'>
                        <div className='flex gap-2 items-center'>
                          <div className='flex gap-2 w-full items-center'>
                            <Form.Item
                              {...restField}
                              name={[name, 'text']}
                              fieldKey={[fieldKey, 'text']}
                              rules={[{ required: true, message: 'Please enter testimonial text' }]}
                              className='w-[15%]'
                            >
                              <TextInput placeholder='testimonial' />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'url']}
                              fieldKey={[fieldKey, 'url']}
                              className='flex-1'
                              rules={[
                                {
                                  pattern: urlRules.pattern,
                                  message: `Please enter a valid URL`
                                }
                              ]}
                            >
                              <TextInput placeholder='URL' />
                            </Form.Item>
                          </div>
                          {fields.length > 1 && (
                            <MinusCircleOutlined className='mb-[25px]' onClick={() => remove(name)} />
                          )}
                        </div>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() => add({ name: null, url: '' })}
                        icon={<PlusOutlined />}
                        className='w-full max-w-[250px]'
                      >
                        Add Testimonial
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
            {isNew && (
              <Form.Item
                name='mediaGalleries'
                rules={[
                  {
                    required: true
                  }
                ]}
                label='Images (Maximum 5 images)'
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            )}
            {isUpdate && (
              <Form.Item
                name='mediaGalleries'
                rules={[
                  {
                    required: false
                  }
                ]}
                label='Images (Maximum 5 images)'
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            )}
          </Form>
        </>
      </ModalContainer>
    </>
  )
}

export default ModalDetail
