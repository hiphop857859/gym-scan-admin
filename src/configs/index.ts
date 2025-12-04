const local = {
  baseURL: import.meta.env.VITE_BASE_URL,
  emailAdmin: import.meta.env.VITE_EMAIL_ADMIN,
  passwordAdmin: import.meta.env.VITE_PASSWORD_ADMIN,
  s3Proxy: import.meta.env.VITE_S3_PROXY,
  ggKey: import.meta.env.VITE_GG_KEY
}

export default {
  ...local
}
