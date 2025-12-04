import { Form, TimePicker, Input, Empty, Button, UploadFile, Upload, Radio } from 'antd'
import Select from 'src/components/Atomic/Form/Select'
import GoogleAutocomplete from 'src/components/Atomic/Form/GoogleAutocomplete'
import SearchArtistPopup from 'src/components/Atomic/Form/SearchArtistPopup'
import { useCallback, useMemo, useState, useRef } from 'react'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import TextInput from 'src/components/Atomic/Form/TextInput'
import DatePicker from 'src/components/Atomic/Custom/DatePicker'
import InputImageList from 'src/components/Atomic/Form/InputImageList'
import ModalContainer from 'src/components/Containers/ModalContainer'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import variableStyles from 'src/enums/variables.style'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { Event, EventPayload, EventsCategoriesResponseList, VideoTypes, EventVideo } from 'src/services/events'
import { uploadImage, uploadVideo } from 'src/services/upload/service'
import { UploadTypes, UploadStatus } from 'src/services/upload'
import { useSearch } from 'src/Hook/useSearch'
import Spin from 'src/components/Atomic/Spin/Spin'
import './index.css'
import {
  FacebookOutlined,
  InstagramOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { acceptedImageTypes, acceptedVideoTypes, imageAccepted } from 'src/constants/file'
import dayjs, { Dayjs } from 'dayjs'
import NumberInput from 'src/components/Atomic/Form/NumberInput'
import { formatTimeLocalToUtc } from 'src/helpers/time'
import { TICKET_TYPE_OPTIONS } from 'src/constants/events'
import { useImageHandler, type ImageWithOriginal } from 'src/Hook/useImageHandler'

const urlRules = {
  pattern: /^(https?:\/\/[^\s,]+)(,\s*https?:\/\/[^\s,]+)*$/,
  message: 'Please enter a valid YouTube URL'
}

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: null | string
  open: boolean
  afterClose?: () => void
}

interface OriginalImage extends UploadFile {
  isOriginal: boolean
}

interface SocialMediaAccount {
  name: string
  url: string
}

interface SocialMedia {
  facebook?: SocialMediaAccount
  instagram?: SocialMediaAccount
  youtube?: SocialMediaAccount
  twitter?: SocialMediaAccount
}

interface EventForm extends Omit<Event, 'imageKeys' | 'endDate' | 'startDate' | 'startTime' | 'endTime'> {
  artistData?: Record<any, any>[]
  endTime: Dayjs
  startTime: Dayjs
  startDate: Dayjs
  endDate: Dayjs
  tickets: any[]
  facebookName: string
  facebookUrl: string
  instagramName: string
  instagramUrl: string
  youtubeName: string
  youtubeUrl: string
  twitterName: string
  twitterUrl: string
  imageKeys: [OriginalImage | UploadFile]
  videoType?: VideoTypes
  videoFile?: { file: UploadFile & { isOriginal: boolean } }
}

const MAX_UPLOAD = 5

const SOCIAL_NETWORKS = [
  { name: 'facebook', icon: <FacebookOutlined className='center-icon' /> },
  { name: 'instagram', icon: <InstagramOutlined className='center-icon' /> },
  { name: 'youtube', icon: <YoutubeOutlined className='center-icon' /> },
  { name: 'twitter', icon: <TwitterOutlined className='center-icon' /> }
]

const ModalDetail = ({ handleCancel, modalDetailId, handleOk, open, afterClose = undefined }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const searchArtistPopupRef = useRef<any>(null)
  const [form] = Form.useForm<Partial<EventForm>>()
  const videoType = Form.useWatch('videoType', form)
  const videoFile = Form.useWatch('videoFile', form)
  const listVideoFile = useMemo(() => {
    return videoType === VideoTypes.FILE && videoFile?.file ? [videoFile.file] : []
  }, [videoType, videoFile])
  const isFileVideo = (type: VideoTypes | undefined) => type === VideoTypes.FILE
  const isUrlVideo = (type: VideoTypes | undefined) => type === VideoTypes.URL
  const isNew = !modalDetailId
  const [originalImages, setOriginalImages] = useState<{ id: string; image: string }[]>([])
  const titleModal = isNew ? 'Create new event' : 'Event detail'
  const { isFormDirty } = useDirtyForm(form)
  const { showSuccess } = useToast()
  const { getNewImages, handleNewImages, handleExistingImages, imagesValidator } = useImageHandler()
  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createEvent, loading: loadingCreate } = useQuery({
    func: Service.createEvent,
    onSuccess: () => {
      showSuccess('Create event success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const { fetch: updateEvent, loading: loadingUpdate } = useQuery({
    func: Service.updateEvent,
    onSuccess: () => {
      showSuccess('Update event success')
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
    setResults: setResultsMusicStyles
  } = useSearch({
    func: Service.getEventsMusicStyles,
    normalizationData: (_, data: any) => [...data]
  })

  const onSearchMusicStyles = (q: string) => {
    return triggerSearchMusicStyles({ q })
  }

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

  const customUpdateImageRequest = async (options: any) => {
    const { file, onSuccess = () => {}, onError = () => {}, onProgress = () => {} } = options || {}
    try {
      const key = await uploadImage({
        file,
        type: UploadTypes.EVENT
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

  const customUpdateVideoRequest = async (options: any) => {
    const { file, onSuccess = () => {}, onError = () => {}, onProgress = () => {} } = options || {}
    try {
      const key = await uploadVideo({ file, type: UploadTypes.EVENT })
      if (key) {
        onProgress({ percent: 100 })
        onSuccess({ key }, file)

        form.validateFields(['videoFile'])
        return
      }

      throw new Error('Uploading video failed')
    } catch (error) {
      onError(error as Error)
    }
  }

  const { loading: loadingDetail } = useQuery({
    func: Service.getEvent,
    isQuery: !isNew,
    options: {
      noCache: true
    },
    params: {
      id: modalDetailId?.toString?.() || ''
    },
    onSuccess: (value) => {
      const startDate = dayjs.utc(value.startDate).local()
      const endDate = dayjs.utc(value.endDate).local()
      const socialMedia = value.socialMedia as SocialMedia
      const videoFile = value.videos?.[0]

      setResultsCategories(value.categories)
      setResultsMusicStyles(value.musicStyles)
      setOriginalImages(value.images || [])

      form.setFieldsValue({
        name: value.name,
        description: value.description,
        location: value.location,
        latitude: value.latitude,
        longitude: value.longitude,
        tickets: value.ticketPrices,
        startDate,
        startTime: startDate,
        endTime: endDate,
        endDate,
        categoryIds: value.categories.map((category) => category.id),
        musicStyleIds: value.musicStyles.map((style) => style.id),
        regulations: value.regulations,
        artistData: value.artists,
        contactEmail: value.contactEmail,
        contactPhoneNumber: value.contactPhoneNumber,
        imageKeys: value.images.map((image) => ({
          uid: image.id,
          url: image.image,
          status: UploadStatus.DONE,
          isOriginal: true,
          name: 'Preview'
        })) as OriginalImage[],
        videoType: value.videoUrl ? VideoTypes.URL : videoFile ? VideoTypes.FILE : VideoTypes.URL,
        videoUrl: value.videoUrl,
        videoFile: videoFile
          ? {
              file: {
                uid: videoFile.id || 'existing-video',
                url: videoFile.videoKey,
                status: UploadStatus.DONE,
                name: videoFile.originalName || 'Video File',
                isOriginal: true
              }
            }
          : undefined,
        ...Object.entries(SOCIAL_NETWORKS).reduce(
          (acc, [, { name }]) => ({
            ...acc,
            [`${name}Name`]: socialMedia[name as keyof SocialMedia]?.name || '',
            [`${name}Url`]: socialMedia[name as keyof SocialMedia]?.url || ''
          }),
          {}
        )
      })
    }
  })

  const getVideoDataBaseHandle = useCallback(
    (values: Partial<EventForm>): { videoUrl: string } | { videos: EventVideo[] } => {
      const { videoType = VideoTypes.URL, videoUrl, videoFile } = values || {}

      if (isFileVideo(videoType)) {
        const key = videoFile?.file?.isOriginal ? videoFile?.file?.url : videoFile?.file?.response?.key
        if (key) {
          return { videos: [{ videoKey: key }] }
        }
      }
      return { videoUrl: videoUrl || '' }
    },
    []
  )

  const getVideoData = useCallback(
    (values: Partial<EventForm>): { videoUrl: string } | { videos: EventVideo[] } => {
      const { videoFile } = values || {}
      const videoData = getVideoDataBaseHandle(values)
      const oldId = videoFile?.file?.isOriginal ? videoFile?.file?.uid : ''

      if (!isNew && 'videos' in videoData && oldId) {
        videoData.videos[0].id = oldId
        return videoData
      }

      return videoData
    },
    [getVideoDataBaseHandle, isNew]
  )

  const videoValidator = useCallback((_: any, video: any) => {
    if (!video.file) return Promise.reject(new Error('video is required.'))

    if (video.file.status === UploadStatus.UPLOADING) {
      return Promise.reject(new Error('Video still uploading'))
    }

    if (video.file.status !== UploadStatus.DONE || !!video.file.error) {
      return Promise.reject(new Error('Video not valid please check and reupload'))
    }

    return Promise.resolve()
  }, [])

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values: Partial<EventForm>) => {
        setIsLoading(true)
        const {
          startDate,
          startTime,
          endDate,
          endTime,
          imageKeys,
          artistData,
          tickets,
          videoType,
          videoUrl,
          videoFile,
          videos,
          ...restValues
        } = values || {}

        const videoData = getVideoData({
          videoType,
          videoUrl,
          videoFile,
          videos
        })

        // Prepare social media data
        const socialMedia = SOCIAL_NETWORKS.reduce<SocialMedia>((acc, { name }) => {
          const socialName = values[`${name}Name` as keyof EventForm] as string
          const socialUrl = values[`${name}Url` as keyof EventForm] as string

          if (socialName && socialUrl) {
            acc[name as keyof SocialMedia] = { name: socialName, url: socialUrl }
          }
          return acc
        }, {})

        // Handle images
        const newImages = getNewImages(imageKeys as ImageWithOriginal[] | undefined)
        const imagesData = isNew
          ? handleNewImages(newImages)
          : handleExistingImages(imageKeys as ImageWithOriginal[] | undefined, originalImages, newImages)

        const newValues: Partial<EventPayload> = {
          ...restValues,
          ...imagesData,
          ...videoData,
          startDate:
            startDate && startTime
              ? formatTimeLocalToUtc(startDate.hour(startTime.hour()).minute(startTime.minute()))
              : '',
          endDate:
            endDate && endTime ? formatTimeLocalToUtc(endDate.hour(endTime.hour()).minute(endTime.minute())) : '',
          artistIds: artistData?.map((artist) => artist.id) || [],
          ticketPrices: tickets,
          socialMedia
        }

        if (isNew) {
          createEvent(newValues)
        } else {
          updateEvent({ payload: newValues, vars: { id: modalDetailId } })
        }
      })
      .catch((e) => {
        console.error('Form validation failed:', e)
      })
  }, [
    createEvent,
    form,
    isNew,
    modalDetailId,
    originalImages,
    updateEvent,
    getNewImages,
    handleNewImages,
    handleExistingImages
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
          <div className='overflow-auto max-w-4xl mx-2 '>
            <Form
              form={form}
              layout='vertical'
              initialValues={{
                regulations: [''],
                tickets: [{ type: null, name: '', price: null, description: '' }]
              }}
            >
              <div className='grid grid-cols-2 gap-4'>
                <Form.Item
                  name='name'
                  label='Event Name'
                  rules={[{ required: true, message: 'Please enter event name' }]}
                >
                  <TextInput placeholder='Event name' />
                </Form.Item>
                <Form.Item name='categoryIds' label='Event Category' rules={[{ required: true }]}>
                  <Select
                    className='multiple'
                    mode='multiple'
                    tokenSeparators={[',']}
                    placeholder='Event Category'
                    onSearch={onSearchCategory}
                    onDropdownVisibleChange={(isOpen) => {
                      isOpen && musicStyles ? onSearchCategory('') : () => {}
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
                <Form.Item name='location' label='Event Address' rules={[{ required: true }]}>
                  <GoogleAutocomplete
                    onChange={(address, coordinates) => {
                      form.setFieldsValue({
                        location: address,
                        longitude: coordinates?.lng,
                        latitude: coordinates?.lat
                      })
                    }}
                  />
                </Form.Item>

                {/* hidden items */}
                <Form.Item name='latitude' hidden />
                <Form.Item name='longitude' hidden />
                {/* end hidden items */}

                <Form.Item name='musicStyleIds' label='Music Style' rules={[{ required: true }]}>
                  <Select
                    className='multiple'
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
                    placeholder='Music Style'
                  />
                </Form.Item>
                <Form.Item
                  name='contactEmail'
                  label='Contact Email'
                  rules={[
                    { required: true, message: 'Please enter contact email' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <TextInput placeholder='Contact email' />
                </Form.Item>
                <Form.Item name='contactPhoneNumber' label='Contact Phone Number'>
                  <TextInput placeholder='Contact phone number (optional)' />
                </Form.Item>

                <Form.Item name='startDate' label='Start Date' rules={[{ required: true }]}>
                  <DatePicker
                    className='w-full'
                    placeholder='Start date'
                    disabledDate={(current) => current && current.isBefore(dayjs().startOf('day'))}
                  />
                </Form.Item>
                <Form.Item name='startTime' label='Start Time' rules={[{ required: true }]}>
                  <TimePicker className='w-full' placeholder='Start time' format={'HH:mm'} />
                </Form.Item>
                <Form.Item
                  name='endDate'
                  label='End Date'
                  dependencies={['startDate']}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue('startDate')
                        if (!startDate) {
                          return Promise.reject(new Error('Please select start date first'))
                        }
                        if (value && value.isBefore(startDate, 'day')) {
                          return Promise.reject(new Error('End date must be after or equal to start date'))
                        }
                        return Promise.resolve()
                      }
                    })
                  ]}
                >
                  <DatePicker
                    className='w-full'
                    placeholder='End date'
                    disabled={!form.getFieldValue('startDate')}
                    disabledDate={(current) => {
                      const startDate = form.getFieldValue('startDate')
                      if (!startDate) return true
                      return current && (current.isBefore(startDate, 'day') || current.isBefore(dayjs().startOf('day')))
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name='endTime'
                  label='End Time'
                  dependencies={['startDate', 'startTime', 'endDate']}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startTime = getFieldValue('startTime')
                        if (!value || !startTime) {
                          return Promise.resolve()
                        }

                        const startDate = getFieldValue('startDate')
                        const start = startDate.hour(startTime.hour()).minute(startTime.minute())
                        const endDate = getFieldValue('endDate')
                        const end = endDate.hour(value.hour()).minute(value.minute())

                        if (end.isBefore(start, 'minute') || end.isSame(start, 'minute')) {
                          return Promise.reject(new Error('End time must be after start time'))
                        }
                        return Promise.resolve()
                      }
                    })
                  ]}
                >
                  <TimePicker className='w-full' placeholder='End time' format={'HH:mm'} />
                </Form.Item>
              </div>

              <div className='p-4 rounded-lg border border-[#374151]'>
                <div className='mb-4'>
                  <h3 className='text-lg font-semibold text-white mb-2'>Video Content</h3>
                  <p className='text-sm text-[#9ca3af] mb-4'>Choose how you want to add video content to your event</p>

                  <Form.Item name='videoType' label='Video Type' initialValue={VideoTypes.URL} className='mb-0'>
                    <Radio.Group className='flex gap-6'>
                      <Radio value={VideoTypes.URL} className='flex items-center'>
                        <span className='ml-2 text-white'>Video URL</span>
                        <span className='ml-2 text-xs text-[#9ca3af]'>(YouTube)</span>
                      </Radio>
                      <Radio value={VideoTypes.FILE} className='flex items-center'>
                        <span className='ml-2 text-white'>Upload Video File</span>
                        <span className='ml-2 text-xs text-[#9ca3af]'>(MP4, MOV, AVI)</span>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>

                {isUrlVideo(videoType) && (
                  <div className='bg-[#111827] p-4 rounded-md border border-[#374151]'>
                    <Form.Item
                      name='videoUrl'
                      label={
                        <span className='flex items-center gap-2'>
                          <span className='text-white font-medium'>Video URL</span>
                          <span className='text-xs text-[#60a5fa] bg-[#1e3a8a] px-2 py-1 rounded'>Recommended</span>
                        </span>
                      }
                      rules={[
                        { type: 'url', message: 'Please enter a valid URL' },
                        { pattern: /^https?:\/\//, message: 'URL must start with http:// or https://' }
                      ]}
                    >
                      <Input
                        placeholder='https://www.youtube.com/watch?v=...'
                        className='h-10'
                        prefix={<span className='text-[#6b7280]'>🔗</span>}
                      />
                    </Form.Item>
                    <p className='text-xs text-[#9ca3af] mt-1'>
                      Supported platforms: YouTube, Vimeo, Dailymotion, and direct video links
                    </p>
                  </div>
                )}

                {!loadingDetail && isFileVideo(videoType) && (
                  <div className='bg-[#111827] p-4 rounded-md border border-[#374151]'>
                    <Form.Item
                      validateTrigger={['change']}
                      name='videoFile'
                      label={
                        <span className='flex items-center gap-2'>
                          <span className='text-white font-medium'>Video File</span>
                          <span className='text-xs text-[#fbbf24] bg-[#92400e] px-2 py-1 rounded'>Upload</span>
                        </span>
                      }
                      className='mb-0'
                      rules={[
                        {
                          validator: videoValidator
                        }
                      ]}
                    >
                      <Upload
                        customRequest={customUpdateVideoRequest}
                        accept={Object.keys(acceptedVideoTypes).join(',')}
                        maxCount={1}
                        fileList={listVideoFile}
                        onChange={(info) => {
                          if (info.fileList.length === 0) {
                            form.setFieldsValue({ videoFile: undefined })
                          }
                        }}
                        className='w-full'
                      >
                        <Button
                          icon={<UploadOutlined />}
                          className='h-10 w-full border-dashed border-2 border-[#4b5563] hover:border-[#60a5fa] hover:text-[#60a5fa]'
                        >
                          {listVideoFile.length > 0 ? 'Replace Video' : 'Click to Upload Video'}
                        </Button>
                      </Upload>
                    </Form.Item>
                    <div className='mt-3 text-xs text-[#9ca3af]'>
                      <p>• Supported formats: {Object.keys(acceptedVideoTypes).join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>

              <Form.Item
                name='imageKeys'
                rules={[
                  {
                    validator: imagesValidator,
                    required: true
                  }
                ]}
                label='Images (Maximum 5 images)'
              >
                <InputImageList
                  customRequest={customUpdateImageRequest}
                  listType='picture-circle'
                  maxCount={MAX_UPLOAD}
                  accepts={Object.keys(acceptedImageTypes) as Array<imageAccepted>}
                />
              </Form.Item>

              <Form.Item name='description' label='Event Description' rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                name='artistData'
                label={
                  <div className='flex items-center space-x-2'>
                    <p className='min-w-[70px]'>List artist:</p>
                    <Button
                      type='dashed'
                      onClick={(e) => {
                        e.preventDefault()
                        searchArtistPopupRef?.current?.handleOpenModal()
                      }}
                      icon={<PlusOutlined />}
                      className='w-full max-w-[250px]'
                    >
                      Add Artist
                    </Button>
                  </div>
                }
                rules={[{ required: true }]}
              >
                <SearchArtistPopup ref={searchArtistPopupRef} />
              </Form.Item>

              <div>
                <div className='grid gap-4'>
                  <div className='require'>Tickets:</div>
                  <Form.List name='tickets'>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }: any) => (
                          <div key={key} className='ticket-entry'>
                            <div className='flex gap-2 items-center'>
                              <div className='flex flex-col gap-2 w-full'>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'type']}
                                  fieldKey={[fieldKey, 'type']}
                                  rules={[{ required: true, message: 'Please select a ticket type' }]}
                                >
                                  <Select
                                    className='multiple !w-full lg:min-w-[24em] sm:min-w-[100px]'
                                    data={TICKET_TYPE_OPTIONS}
                                    placeholder='Ticket type'
                                  />
                                </Form.Item>

                                <Form.Item
                                  {...restField}
                                  name={[name, 'name']}
                                  fieldKey={[fieldKey, 'name']}
                                  rules={[{ required: true, message: 'Please enter the ticket name' }]}
                                >
                                  <TextInput
                                    placeholder='Ticket Name'
                                    className='w-full lg:min-w-[24em] sm:min-w-[100px]'
                                  />
                                </Form.Item>
                              </div>
                              <div className='flex flex-col gap-2'>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'price']}
                                  fieldKey={[fieldKey, 'price']}
                                  rules={[
                                    { required: true, message: 'Please enter the ticket price' },
                                    {
                                      type: 'number',
                                      min: 0,
                                      message: 'The ticket price must be greater than 0'
                                    }
                                  ]}
                                >
                                  <NumberInput className='max-h-[42px]' placeholder='Ticket price' />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'description']}
                                  fieldKey={[fieldKey, 'description']}
                                  rules={[{ required: true, message: 'Please enter the ticket description' }]}
                                >
                                  <TextInput
                                    placeholder='Ticket description'
                                    className='w-full lg:min-w-[24em] sm:min-w-[100px]'
                                  />
                                </Form.Item>
                              </div>
                              {fields.length > 1 && !form.getFieldValue('tickets')?.[name]?.bookingDetails?.length && (
                                <MinusCircleOutlined onClick={() => remove(name)} />
                              )}
                            </div>
                            {fields.length > 1 && <div className='w-full h-[1px] bg-[#d9d9d9]' />}
                          </div>
                        ))}
                        <Form.Item>
                          <Button
                            type='dashed'
                            onClick={() => add({ type: null, name: '', price: null, description: '' })}
                            icon={<PlusOutlined />}
                            className='w-full max-w-[250px]'
                          >
                            Add Ticket
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
                <div className='grid gap-4'>
                  <div>Regulations:</div>
                  <Form.List name='regulations'>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <div key={key} className='regulation-entry'>
                            <div className='flex gap-2 w-full'>
                              <Form.Item
                                {...restField}
                                name={name}
                                fieldKey={fieldKey}
                                rules={[
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      const regulations = getFieldValue('regulations') || []
                                      const isDuplicate = regulations.some(
                                        (regulation: string, index: number) => regulation === value && index !== name
                                      )
                                      if (isDuplicate) {
                                        return Promise.reject(new Error('Regulation must be unique'))
                                      }
                                      return Promise.resolve()
                                    }
                                  })
                                ]}
                                className='w-full'
                              >
                                <TextInput
                                  placeholder='Regulation'
                                  className='w-full lg:min-w-[24em] sm:min-w-[100px]'
                                />
                              </Form.Item>
                              {fields.length > 1 && (
                                <MinusCircleOutlined className='center-icon' onClick={() => remove(name)} />
                              )}
                            </div>
                            {fields.length > 1 && <div className='w-full h-[1px] bg-[#d9d9d9]' />}
                          </div>
                        ))}
                        <Form.Item>
                          <Button
                            type='dashed'
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                            className='w-full max-w-[250px]'
                          >
                            Add Regulation
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
                <div className='flex flex-col gap-4 w-full'>
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
              </div>
            </Form>
          </div>
        </>
      </ModalContainer>
    </>
  )
}

export default ModalDetail
