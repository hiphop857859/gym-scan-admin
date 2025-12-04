import React, { useState, useEffect } from 'react'
import { Avatar, Spin } from 'antd'

interface AvatarWithLoaderProps {
  src: string
  size?: number
  // Allow any additional props for the Avatar component
  [key: string]: any
}

const AvatarWithLoader: React.FC<AvatarWithLoaderProps> = ({ src, size = 64, ...props }) => {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
  }, [src])

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {loading && (
        <Spin
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
      <Avatar
        src={src}
        size={size}
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        {...props}
      />
    </div>
  )
}

export default AvatarWithLoader
