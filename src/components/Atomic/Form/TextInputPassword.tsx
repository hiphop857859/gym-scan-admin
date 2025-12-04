// import { CloseCircleOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { customIsEmpty } from 'src/helpers/ultils'
import Label from './Label'

export type Props = {
  value?: string
  onChange?: (...args: any[]) => void
  onClear?: (...args: any[]) => void
  placeholder: string
  name?: string
  label?: string
  disabled?: boolean
  onPressEnter?: (...args: any[]) => void
}

const TextInputPass = ({
  value = '',
  label,
  onChange,
  // onClear,
  placeholder = '',
  name = '',
  disabled = false,
  onPressEnter
}: Props) => (
  <>
    {label && (
      <Label>
        {label} <span className='text-error-500'>*</span>{' '}
      </Label>
    )}
    <Input.Password
      className='h-11 outline-4 border-1 active:border-primary-600 active:border-4'
      onPressEnter={onPressEnter}
      // allowClear={{
      //   clearIcon: (
      //     <CloseCircleOutlined
      //       onClick={() => {
      //         onClear && onClear()
      //       }}
      //     />
      //   )
      // }}
      onChange={(e) => {
        const tempValue = { ...e }
        if (customIsEmpty(tempValue)) {
          onChange && onChange(e)
        } else {
          onChange && onChange({ ...e, name, value: e.target.value })
        }
      }}
      placeholder={placeholder}
      name={name}
      value={value}
      maxLength={200}
      disabled={disabled}
    />
  </>
)

export default TextInputPass
