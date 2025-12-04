import { Spin as SpinAntd } from 'antd'
import React from 'react'
import { CirclesFourIcon } from 'src/icons/CirclesFourIcon'
import type { SpinProps } from 'antd'

export type Props = SpinProps & {
  spinning: boolean
  children?: React.ReactNode
}

const Spin = ({ spinning, children }: Props) => (
  <SpinAntd indicator={<CirclesFourIcon color='#1668dc' className='animate-spin  ' />} spinning={spinning}>
    {children}
  </SpinAntd>
)

export default Spin
