export const extractFileNameFromURL = (_url: string | null | undefined) => {
  if (!_url) return ''
  const url = _url
  const fullFileName = url.split('/').pop()
  const fileName = fullFileName?.substring(fullFileName.indexOf('-') + 1)
  return fileName
}
