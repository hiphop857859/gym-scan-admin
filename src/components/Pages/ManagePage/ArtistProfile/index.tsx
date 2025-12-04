import { Form, Empty, Input, Checkbox, Button } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import TextInput from 'src/components/Atomic/Form/TextInput'
import DatePicker from 'src/components/Atomic/Custom/DatePicker'
import InputImageList from 'src/components/Atomic/Form/InputImageList'
import Select from 'src/components/Atomic/Form/Select'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { Artist, ArtistDetail } from 'src/services/artists/types'
import { acceptedImageTypes, imageAccepted } from 'src/constants/file'
import { uploadImage } from 'src/services/upload/service'
import { UploadTypes, UploadStatus } from 'src/services/upload'
import Spin from 'src/components/Atomic/Spin/Spin'
import { useSearch } from 'src/Hook/useSearch'
import dayjs, { formatTimeStartOfDate } from 'src/helpers/time'
import {
  CheckCircleOutlined,
  EditFilled,
  FacebookOutlined,
  InstagramOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  TwitterOutlined,
  YoutubeOutlined
} from '@ant-design/icons'
import { useImageHandler } from 'src/Hook/useImageHandler'
import { ArtistType } from '../Artists/Columns'
import { useAuthStore } from 'src/store'
import { useNavigate, useParams } from 'react-router-dom'
import GooglePlacesAutocomplete from 'src/components/Atomic/Form/GoogleAutocomplete'
import './index.css'
import { useModals } from 'src/Hook/useModalStore'
import { UserRole } from 'src/services/user'

type SocialMediaName = 'facebook' | 'instagram' | 'youtube' | 'twitter'

const SOCIAL_NETWORKS: Array<{ name: SocialMediaName; icon: JSX.Element }> = [
  { name: 'facebook', icon: <FacebookOutlined className='center-icon' /> },
  { name: 'instagram', icon: <InstagramOutlined className='center-icon' /> },
  { name: 'youtube', icon: <YoutubeOutlined className='center-icon' /> },
  { name: 'twitter', icon: <TwitterOutlined className='center-icon' /> }
]

const listeningLinks = ['Soundcloud', 'Spotify', 'Apple Music', 'YouTube']

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
const MAX_UPLOAD = 5

const ArtistProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { showSuccess } = useToast()
  const [form] = Form.useForm<Partial<Omit<any, 'dateOfBirth'> & { dateOfBirth: dayjs.Dayjs }>>()
  const [authenticationData] = useAuthStore()
  const { imagesValidator } = useImageHandler()
  const { isFormDirty } = useDirtyForm(form)
  const [isEditMode, setIsEditMode] = useState(false)
  const { id } = useParams()
  const isAdmin = authenticationData.userInfo?.roles.includes(UserRole.ADMIN)
  const handleSuccess = () => {
    setIsEditMode(false)
  }

  const { fetch: updateDraftArtist, loading: loadingUpdate } = useQuery({
    func: Service.submitDraftArtist,
    onSuccess: () => {
      showSuccess('Update artist profile success, waiting for admin approval')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const { fetch: approveDraftArtist, loading: loadingApprove } = useQuery({
    func: Service.approveDraftArtist,
    params: {
      id: id || ''
    },
    onSuccess: () => {
      showSuccess('Approve artist profile success')
      navigate('/artists')
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

  const setValueForm = (_value: ArtistDetail) => {
    setMusicStylesResults(_value.musicStyles)
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
      }, {}),
      location: _value.location,
      bookingContactEmail: _value.bookingContactEmail,
      bookingContactPhoneNumber: _value.bookingContactPhoneNumber,
      averageFee: _value.averageFee,
      isFeeNegotiable: _value.isFeeNegotiable,
      availabilityCalendar: _value.availabilityCalendar?.map((item) => ({
        ...item,
        startDate: item.startDate ? dayjs.utc(item.startDate).local() : null,
        endDate: item.endDate ? dayjs.utc(item.endDate).local() : null
      })),
      listeningLinks: _value.listeningLinks?.length ? _value.listeningLinks : [],
      technicalRequirements: _value.technicalRequirements,
      references: _value.references
    })
  }

  const { openModalConfirmOut, openModalApprove } = useModals({
    handleModalConfirmOutOk: (record, close) => {
      const value = record as ArtistDetail
      const formValue = {
        ...value,
        images: (value?.images || []).map((image: unknown) => ({ id: image as string, image: image as string }))
      }
      setValueForm(formValue)
      close?.()
    },
    handleModalApproveOk: (_record, close) => {
      setIsLoading(true)
      approveDraftArtist({
        id: id || ''
      })
      close?.()
    }
  })

  const { loading: loadingDetail } = useQuery({
    func: Service.getDraftArtist,
    isQuery: !authenticationData.artistInfo?.id,
    options: {
      noCache: true
    },
    params: {
      id: id || ''
    },
    onSuccess: (_value) => {
      setValueForm(_value)
    }
  })

  const handleCancel = () => {
    setIsEditMode(false)
    if (authenticationData.artistInfo) {
      setValueForm(authenticationData.artistInfo)
    }
  }

  const handleEditSwitch = async () => {
    try {
      setIsLoading(true)
      const draftArtist = await Service.myPendingDraft()
      if (draftArtist) {
        openModalConfirmOut(draftArtist, "You're still waiting for admin approval. Do you want to continue editing?")
      }
      setIsLoading(false)
      setIsEditMode(true)
    } catch (error) {
      // No pending draft, proceed to edit mode
    }
  }

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values: any) => {
        setIsLoading(true)
        const { imageKeys, ...restValues } = values
        const newValues = {
          ...restValues,
          images: imageKeys.map((item: any) => (item.response ? item.response.key : item.url)),
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
        updateDraftArtist(newValues)
      })
      .catch(() => {})
  }, [form, updateDraftArtist])

  const approveProfile = () => {
    openModalApprove({
      record: id,
      message: 'Are you sure you want to approve this artist profile?'
    })
  }

  const loading = loadingDetail || isLoading || loadingUpdate || loadingApprove

  useEffect(() => {
    if (authenticationData.artistInfo) {
      setValueForm(authenticationData.artistInfo)
    }
  }, [])

  return (
    <div>
      <Form
        layout='vertical'
        className='grid grid-cols-1 gap-1 mr-2'
        autoComplete='off'
        form={form}
        disabled={!isEditMode}
      >
        <div className='grid grid-cols-2 gap-4'>
          <Form.Item name={'name'} rules={[{ required: true, type: 'string' }]} label='Name'>
            <TextInput placeholder='Name' disabled={!isEditMode} />
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
              disabled={!isEditMode}
            />
          </Form.Item>
          <Form.Item name={'dateOfBirth'} rules={[{ type: 'date' }]} label='Date of birth'>
            <DatePicker placeholder='Date of birth' />
          </Form.Item>
          <Form.Item name={'placeOfBirth'} rules={[{ type: 'string' }]} label='Place of birth'>
            <TextInput placeholder='Place of birth' disabled={!isEditMode} />
          </Form.Item>

          <Form.Item name='location' label='Location' rules={[{ required: true }]}>
            <GooglePlacesAutocomplete
              onChange={(address, coordinates) => {
                form.setFieldsValue({
                  location: address,
                  longitude: coordinates?.lng,
                  latitude: coordinates?.lat
                })
              }}
              disabled={!isEditMode}
            />
          </Form.Item>

          {/* hidden items */}
          <Form.Item name='latitude' hidden />
          <Form.Item name='longitude' hidden />
          {/* end hidden items */}
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
              disabled={!isEditMode}
            />
          </Form.Item>
        </div>
        <Form.Item name={'occupation'} rules={[{ required: true, type: 'string' }]} label='Short Bio'>
          <Input.TextArea placeholder='Short Bio' rows={2} />
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
            disabled={!isEditMode}
          />
        </Form.Item>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div>Social network</div>
            <div className='flex flex-col gap-7.5 w-full mt-2'>
              {SOCIAL_NETWORKS.map(({ name, icon }) => (
                <div key={name} className='flex gap-2 w-full pr-2'>
                  {icon}
                  <Form.Item name={`${name}Name`} className='flex-1 social-form'>
                    <TextInput
                      placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} Name`}
                      className='w-full lg:min-w-[24em] sm:min-w-[100px]'
                      disabled={!isEditMode}
                    />
                  </Form.Item>
                  <Form.Item
                    name={`${name}Url`}
                    dependencies={[`${name}Name`]}
                    className='social-form flex-1'
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
                      disabled={!isEditMode}
                    />
                  </Form.Item>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <Form.Item
              name='bookingContactEmail'
              label='Booking contact email'
              rules={[{ type: 'email', message: 'Please enter a valid email address' }]}
            >
              <TextInput placeholder='Contact email' disabled={!isEditMode} />
            </Form.Item>
            <Form.Item name='bookingContactPhoneNumber' label='Booking contact phone number'>
              <TextInput placeholder='Booking contact phone number (optional)' disabled={!isEditMode} />
            </Form.Item>
            <Form.Item name='averageFee' label='Average Fee'>
              <TextInput placeholder='Average Fee' disabled={!isEditMode} />
            </Form.Item>
            <Form.Item name='isFeeNegotiable' label='Negotiable' valuePropName='checked'>
              <Checkbox />
            </Form.Item>
          </div>
        </div>
        <div className='grid gap-2'>
          <div>Availability</div>
          <Form.List name='availabilityCalendar'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }: any) => (
                  <div key={key} className='ticket-entry'>
                    <div className='flex gap-2 items-center'>
                      <div className='flex gap-2 w-full'>
                        <Form.Item
                          {...restField}
                          name={[name, 'startDate']}
                          fieldKey={[fieldKey, 'startDate']}
                          rules={[{ required: true, message: 'Please select start date' }]}
                          className='w-[15%]'
                        >
                          <DatePicker placeholder='Start date' className='w-full' />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'endDate']}
                          fieldKey={[fieldKey, 'endDate']}
                          rules={[{ required: true, message: 'Please select end date' }]}
                          className='w-[15%]'
                        >
                          <DatePicker placeholder='End date' className='w-full' />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'note']}
                          fieldKey={[fieldKey, 'note']}
                          className='flex-1'
                        >
                          <TextInput placeholder='Note' disabled={!isEditMode} />
                        </Form.Item>
                      </div>
                      {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
                    </div>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type='dashed'
                    onClick={() => add({ startDate: null, endDate: null, note: '' })}
                    icon={<PlusOutlined />}
                    className='w-full max-w-[250px]'
                  >
                    Add Availability time
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
        <div className='grid gap-2'>
          <div>Music Links</div>
          <Form.List name='listeningLinks'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }: any) => (
                  <div key={key} className='ticket-entry'>
                    <div className='flex gap-2 items-center'>
                      <div className='flex gap-2 w-full items-center'>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                          rules={[{ required: true, message: 'Please enter listening name' }]}
                          className='w-[15%]'
                        >
                          <Select
                            placeholder='Name'
                            className='h-full w-[200px]'
                            data={listeningLinks.map((link) => ({
                              id: link,
                              name: link,
                              code: link
                            }))}
                            keyItem='id'
                            valueItem='id'
                            disabled={!isEditMode}
                          />
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
                          <TextInput placeholder='URL' disabled={!isEditMode} />
                        </Form.Item>
                      </div>
                      {fields.length > 1 && <MinusCircleOutlined className='mb-[25px]' onClick={() => remove(name)} />}
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
                    Add Music Link
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Form.Item name={'technicalRequirements'} rules={[{ type: 'string' }]} label='Technical Rider'>
            <Input.TextArea placeholder='Technical Rider' rows={4} />
          </Form.Item>
          <Form.Item name={'references'} rules={[{ type: 'string' }]} label='References'>
            <Input.TextArea placeholder='References' rows={4} />
          </Form.Item>
        </div>
        {isEditMode ? (
          <div className='flex justify-end gap-2 mt-4'>
            <ButtonCancel isModal={isFormDirty} onClick={handleCancel} />
            <ButtonConfirm disabled={!isFormDirty} isLoading={loading} onClick={handleSubmit} />
          </div>
        ) : isAdmin ? (
          <div className='flex justify-end gap-2 mt-4'>
            <Button disabled={false} size='large' onClick={approveProfile}>
              <CheckCircleOutlined />
              Approve Profile
            </Button>
          </div>
        ) : (
          <div className='flex justify-end gap-2 mt-4'>
            <Button disabled={false} size='large' onClick={handleEditSwitch}>
              <EditFilled />
              Edit Profile
            </Button>
          </div>
        )}
      </Form>
    </div>
  )
}

export default ArtistProfile
