import { Form } from 'antd'
import { Language } from 'src/types'
import TextArea from '../../Form/TextArea'

type Props = {
  language?: keyof Language
  parentKey?: string
  label?: string
}

const FormItemDescription = ({ language = 'en', label, parentKey = 'description' }: Props) => {
  const _name = [parentKey, language]
  const _label = label ? label : language === 'en' ? 'Description EN 🇬🇧' : 'Description FR 🇫🇷'
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
      <TextArea placeholder='' />
    </Form.Item>
  )
}

export default FormItemDescription
