import { Service } from 'src/services'
import { UploadTypes } from './types'
import env from 'src/configs/index'

const s3Upload = async (s3Url: string, file: File) => {
  let _url = s3Url
  const s3Proxy = env.s3Proxy
  if (env.s3Proxy) {
    const urlInstance = new URL(s3Url)
    _url = s3Proxy + urlInstance.pathname
  }

  const uploadResponse = await fetch(_url, {
    method: 'PUT',
    body: file
  })

  if (uploadResponse.ok) return true

  throw new Error('Upload to s3 failed')
}

const uploadImage = async (payload: {
  file: File
  type: UploadTypes
  onProgress?: (params: any) => void
}): Promise<string | false> => {
  const { file, type, onProgress = () => {} } = payload || {}

  try {
    if (!(file instanceof File)) throw new Error(`Invalid file type ${file}`)
    const { name: fileName, type: contentType, size: contentLength } = file || {}
    const { presignedUrl, key } = await Service.presignedUrl({
      fileName,
      contentType,
      contentLength,
      uploadType: type
    })
    onProgress({ percent: 50 })
    await s3Upload(presignedUrl, file)

    return key
  } catch {
    return false
  }
}

const uploadVideo = async (...args: Parameters<typeof uploadImage>): ReturnType<typeof uploadImage> =>
  uploadImage(...args)

export { uploadImage, uploadVideo }
