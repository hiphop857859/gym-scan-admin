import { Form } from 'antd'
import TextInput from '../../Form/TextInput'
import { Language } from 'src/types'

type Props = {
  language?: keyof Language
  parentKey?: string
  label?: string
}

const FormItemTextInput = ({ language = 'en', label, parentKey = 'name' }: Props) => {
  const _name = [parentKey, language]
  const _label = label ? label : language === 'en' ? 'Name EN 🇬🇧' : 'Name FR 🇫🇷'
  return (
    <Form.Item
      rules={[
        {
          required: true,
          type: 'string'
        }
      ]}
      name={_name}
      label={_label}
    >
      <TextInput placeholder='' />
    </Form.Item>
  )
}

export default FormItemTextInput
