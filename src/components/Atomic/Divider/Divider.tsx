import React from 'react'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  _style?: string
}

const Divider = ({ ...props }: Props) => {
  return (
    <div className={`w-full border border-t-0 border-l-0 border-r-0 border-divider ${props._style}`} {...props}></div>
  )
}

export default Divider
