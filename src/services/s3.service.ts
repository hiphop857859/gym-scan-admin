const s3Service = {
  uploadImage: async (payload: { file: File; s3Url: string }) => {
    const { file, s3Url } = payload

    const uploadResponse = await fetch(s3Url, {
      method: 'PUT',
      body: file
    })

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text()
      console.error('Upload failed:', errorBody)
      throw new Error(`Failed to upload file. Status: ${uploadResponse.status}`)
    }

    const [iconUrl] = s3Url.split('?')
    return iconUrl
  }
}

export default s3Service
