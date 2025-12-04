import { Select, SelectProps } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'

const TimeZonePicker: React.FC<SelectProps> = ({ value, className, ...props }) => {
  const [timeZones, setTimeZones] = useState<string[]>([])

  useEffect(() => {
    const zones = moment.tz.names()
    setTimeZones(zones)
  }, [])

  return (
    <Select
      className={`font-semibold text-primary-500 border-info-main ${className} !min-h-[40px] !max-h-[40px]`}
      {...props}
      value={value}
      placeholder='Select Time Zone'
      style={{ width: '100%' }}
      showSearch
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      options={timeZones.map((zone) => ({
        value: zone,
        label: zone.replace('_', ' ')
      }))}
    />
  )
}

export default TimeZonePicker
