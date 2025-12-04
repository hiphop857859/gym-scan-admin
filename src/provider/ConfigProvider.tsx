// src/components/ConfigProviderWrapper.tsx

import React from 'react'
import { ConfigProvider, theme } from 'antd'
import { useTheme } from './ThemeProvider'

const ConfigProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme: currentTheme } = useTheme()

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorBgBase: currentTheme === 'dark' ? '#070c16' : '#FFFFFF',
          colorTextBase: currentTheme === 'dark' ? '#F9FAFB' : '#1F2937',
          colorText: currentTheme === 'dark' ? '#F9FAFB' : '#1F2937',
          colorTextPlaceholder: currentTheme === 'dark' ? '#D1D5DB' : '#9CA3AF',
        }
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default ConfigProviderWrapper
