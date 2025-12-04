import { UploadFile } from 'antd'
import { UploadStatus } from 'src/services/upload'

interface OriginalImage extends UploadFile {
  isOriginal: boolean
}

interface UploadedImage {
  id: string
  image: string
}

interface ImageData {
  id: string | null
  imageKey: string | null
  shouldDelete: boolean
}

type ImageWithOriginal = OriginalImage | UploadFile

export const useImageHandler = () => {
  const getNewImages = (imageKeys: ImageWithOriginal[] | undefined): UploadFile[] => {
    return (
      imageKeys?.filter(
        (image): image is UploadFile => !('isOriginal' in image) || !(image as OriginalImage).isOriginal
      ) || []
    )
  }

  const handleNewImages = (newImages: UploadFile[]): { imageKeys: string[] } => {
    return {
      imageKeys: newImages.map((image) => image.response.key)
    }
  }

  const handleExistingImages = (
    imageKeys: ImageWithOriginal[] | undefined,
    originalImages: UploadedImage[],
    newImages: UploadFile[]
  ): { images: ImageData[] | null } => {
    const hasChanges = newImages.length > 0 || originalImages.length !== (imageKeys?.length || 0)
    if (!hasChanges) {
      return { images: null }
    }

    // Create a map of existing image IDs for faster lookup
    const existingImageMap =
      imageKeys?.reduce<Record<string, boolean>>((acc, image) => {
        if (image.uid) {
          acc[image.uid] = true
        }
        return acc
      }, {}) || {}

    const processedOriginalImagesStatus = originalImages.reduce<ImageData[]>((acc, image) => {
      const data = {
        id: image.id,
        imageKey: null,
        shouldDelete: false
      }

      if (!existingImageMap[image.id]) data.shouldDelete = true

      acc.push(data)

      return acc
    }, [])

    // Add new images
    const newImagesData = newImages.map<ImageData>((image) => ({
      id: null,
      imageKey: image.response.key,
      shouldDelete: false
    }))

    return { images: [...processedOriginalImagesStatus, ...newImagesData] }
  }

  const imagesValidator = (_: any, images: any) => {
    if (!images) return Promise.reject(new Error('Images is required.'))

    for (const image of images) {
      if (image.status === UploadStatus.UPLOADING) {
        return Promise.reject(new Error('Some image still uploading'))
      }

      if (image.status !== UploadStatus.DONE || !!image.error) {
        return Promise.reject(new Error('Some image not valid please check and reupload'))
      }
    }

    return Promise.resolve()
  }

  return {
    getNewImages,
    handleNewImages,
    handleExistingImages,
    imagesValidator
  }
}

export type { OriginalImage, UploadedImage, ImageData, ImageWithOriginal }
