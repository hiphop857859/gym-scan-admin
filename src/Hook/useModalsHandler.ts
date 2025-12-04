import { useState } from 'react'

export const useModalsHandler = () => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [isRender, setRenderModal] = useState<boolean>(false)

  return { isOpen, setOpen, isRender, setRenderModal }
}
