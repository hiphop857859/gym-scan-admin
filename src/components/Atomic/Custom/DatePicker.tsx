import generatePicker from 'antd/es/date-picker/generatePicker'
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs'
import type { Dayjs } from 'dayjs'
import { FORMAT_DATE } from 'src/constants/time'

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)

DatePicker.defaultProps = {
  ...DatePicker.defaultProps,
  format: FORMAT_DATE
}

export default DatePicker
