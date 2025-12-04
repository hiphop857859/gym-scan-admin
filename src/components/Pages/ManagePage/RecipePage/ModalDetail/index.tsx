import { Form } from 'antd'
import TextInput from 'src/components/Atomic/Form/TextInput'
import NumberInput from 'src/components/Atomic/Form/NumberInput'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ModalContainer from 'src/components/Containers/ModalContainer'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { Service } from 'src/services'
import Select from 'src/components/Atomic/Form/Select'
import TextArea from 'src/components/Atomic/Form/TextArea'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: boolean | string
}

const mealTypes = [
  { name: 'MEAL', id: 'MEAL' },
  { name: 'SMOOTHIE', id: 'SMOOTHIE' },
  { name: 'SNACK / BREAKFAST', id: 'SNACK / BREAKFAST' },
  { name: 'DESSERT', id: 'DESSERT' }
]

const ModalDetail = ({ handleCancel, handleOk, modalDetailId }: Props) => {
  const isNew = modalDetailId === true
  const [form] = Form.useForm()
  const { isFormDirty } = useDirtyForm(form)
  const { showSuccess } = useToast()

  const title = isNew ? 'Create Recipe' : 'Update Recipe'

  // Create
  const { fetch: createRecipe, loading: loadingCreate } = useQuery({
    func: Service.createRecipe,
    onSuccess: () => {
      showSuccess('Recipe created')
      handleOk?.()
      handleCancel()
    }
  })

  // Update
  const { fetch: updateRecipe, loading: loadingUpdate } = useQuery({
    func: Service.updateRecipe,
    onSuccess: () => {
      showSuccess('Recipe updated')
      handleOk?.()
      handleCancel()
    }
  })

  // Get detail if editing
  useQuery({
    func: Service.getRecipeDetail,
    isQuery: !isNew,
    params: { id: modalDetailId },
    onSuccess: (res) => {
      form.setFieldsValue({
        name: res.name,
        type: res.type,
        description: res.description,
        time: res.time,
        tags: res.tags.join(','),
        kcal: res.kcal,
        proteins: res.proteins,
        carbs: res.carbs,
        fats: res.fats,
        instructions: res.instructions.join('\n'), // Convert array → multiline text
        ingredients: res.ingredients // Already array
      })
    }
  })

  const onSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,

        // convert tags: "a,b" -> ["a", "b"]
        tags: values.tags
          ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [],

        // instructions: textarea -> array
        instructions: values.instructions
          ? values.instructions.split('\n').map((i: string) => i.trim()).filter(Boolean)
          : [],

        // ensure ingredients is array
        ingredients: Array.isArray(values.ingredients) ? values.ingredients : []
      }

      console.log("FINAL PAYLOAD SENT TO API:", payload)

      if (isNew) return createRecipe(payload)

      return updateRecipe({
        vars: { id: modalDetailId },

        payload
      })
    })
  }

  const footer = (
    <ModalFooterContainer
      array={[
        <>
          <ButtonCancel onClick={handleCancel} />
          <ButtonConfirm
            disabled={!isFormDirty}
            isLoading={loadingCreate || loadingUpdate}
            onClick={onSubmit}
          />
        </>
      ]}
    />
  )

  return (
    <ModalContainer title={title} footer={footer} onCancel={handleCancel} destroyOnClose>
      <Form layout="vertical" form={form} autoComplete="off">

        {/* BASIC INFO */}
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <TextInput placeholder="Recipe name" />
        </Form.Item>

        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
          <Select data={mealTypes} keyItem="id" valueItem="id" placeholder="Select meal type" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextInput placeholder="Short description" />
        </Form.Item>

        <Form.Item label="Time" name="time" rules={[{ required: true }]}>
          <TextInput placeholder="e.g. 7:30 PM" />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <TextInput placeholder="high-protein, gym, low-carb" />
        </Form.Item>

        {/* MACROS */}
        <div className="grid grid-cols-4 gap-2">
          <Form.Item label="kcal" name="kcal" rules={[{ required: true }]}>
            <NumberInput />
          </Form.Item>
          <Form.Item label="Protein" name="proteins" rules={[{ required: true }]}>
            <NumberInput />
          </Form.Item>
          <Form.Item label="Carbs" name="carbs" rules={[{ required: true }]}>
            <NumberInput />
          </Form.Item>
          <Form.Item label="Fats" name="fats" rules={[{ required: true }]}>
            <NumberInput />
          </Form.Item>
        </div>

        {/* INGREDIENTS */}
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <div className="mt-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Ingredients</h3>
                <ButtonConfirm text="+ Add Ingredient" onClick={() => add()} />
              </div>

              {/* Each Ingredient */}
              {fields.map(({ key, name }) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4 shadow-md"
                >
                  <div className="grid grid-cols-12 gap-4 items-start">
                    {/* Name */}
                    <div className="col-span-4">
                      <Form.Item
                        label="Name"
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <TextInput placeholder="E.g. Chicken breast" />
                      </Form.Item>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-3">
                      <Form.Item
                        label="Quantity"
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <TextInput placeholder="150g" />
                      </Form.Item>
                    </div>

                    {/* Description */}
                    <div className="col-span-4">
                      <Form.Item label="Description" name={[name, 'description']}>
                        <TextInput placeholder="optional..." />
                      </Form.Item>
                    </div>

                    {/* Remove button */}
                    <div className="col-span-1 flex items-center justify-end mt-6">
                      <button
                        onClick={() => remove(name)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10
                           px-2 py-1 rounded-md transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Form.List>

        {/* INSTRUCTIONS */}
        <Form.Item
          label="Instructions (each step on a new line)"
          name="instructions"
          rules={[{ required: true }]}
        >
          <TextArea rows={5} placeholder="Step 1\nStep 2\nStep 3..." />
        </Form.Item>

      </Form>
    </ModalContainer>
  )
}

export default ModalDetail
