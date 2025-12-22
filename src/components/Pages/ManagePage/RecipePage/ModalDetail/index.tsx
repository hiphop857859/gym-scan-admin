import { Form, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

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
import ButtonAdd from 'src/components/Atomic/Button/ButtonAdd'

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

  /* ================= INGREDIENT LIBRARY ================= */
  const [ingredientLibrary, setIngredientLibrary] = useState<any[]>([])

  useQuery({
    func: Service.getIngredientLibrary,
    isQuery: true,
    onSuccess: (res) => {
      setIngredientLibrary(Array.isArray(res) ? res : [])
    }
  })

  const selectedType = Form.useWatch('type', form)

  const ingredientOptions = useMemo(() => {
    if (!selectedType) return []

    const baseOptions = ingredientLibrary
      .filter((item) => item.category === selectedType)
      .map((item) => ({
        id: item.name,
        name: item.name
      }))

    const currentIngredients = form.getFieldValue('ingredients') || []

    currentIngredients.forEach((ing: any) => {
      if (ing?.name && !baseOptions.find((opt) => opt.id === ing.name)) {
        baseOptions.push({ id: ing.name, name: ing.name })
      }
    })

    return baseOptions
  }, [ingredientLibrary, selectedType])

  /* ================= RESET INGREDIENTS WHEN CREATE ================= */
  useEffect(() => {
    if (isNew && selectedType) {
      form.setFieldsValue({ ingredients: [] })
    }
  }, [selectedType, isNew])

  const title = isNew ? 'Create Recipe' : 'Update Recipe'

  /* ================= CREATE ================= */
  const { fetch: createRecipe, loading: loadingCreate } = useQuery({
    func: Service.createRecipe,
    onSuccess: () => {
      showSuccess('Recipe created')
      handleCancel()
      handleOk?.()
    }
  })

  /* ================= UPDATE ================= */
  const { fetch: updateRecipe, loading: loadingUpdate } = useQuery({
    func: Service.updateRecipe,
    onSuccess: () => {
      showSuccess('Recipe updated')
      handleCancel()
      handleOk?.()
    }
  })

  /* ================= DETAIL ================= */
  const { fetch: fetchRecipeDetail } = useQuery({
    func: Service.getRecipeDetail,
    onSuccess: (res) => {
      form.resetFields()
      form.setFieldsValue({
        name: res.name,
        type: res.type,
        description: res.description,
        time: res.time ? dayjs(res.time, 'HH:mm') : null,
        tags: res.tags?.join(','),
        kcal: res.kcal,
        proteins: res.proteins,
        carbs: res.carbs,
        fats: res.fats,
        instructions: Array.isArray(res.instructions) ? res.instructions : [],

        ingredients: Array.isArray(res.ingredients)
          ? res.ingredients.map((item: any) => ({
            ...item,
            gram: item.gam ?? 0 // 🔥 map gam → gram cho UI
          }))
          : []
      })
    }
  })

  /* ================= CALL DETAIL WHEN EDIT ================= */
  useEffect(() => {
    if (modalDetailId && modalDetailId !== true) {
      fetchRecipeDetail({ id: modalDetailId })
    }

    if (modalDetailId === true) {
      form.resetFields()
    }
  }, [modalDetailId])

  /* ================= SUBMIT ================= */
  const onSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        time: values.time ? values.time.format('HH:mm') : null,
        tags: values.tags
          ? values.tags
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
          : [],
        instructions: Array.isArray(values.instructions)
          ? values.instructions
            .map((i: string) => i.trim())
            .filter(Boolean)
          : [],

        ingredients: Array.isArray(values.ingredients)
          ? values.ingredients.map((item: any) => {
            const { gram, ...rest } = item

            return {
              ...rest,
              gam: gram // 🔥 map gram → gam (CREATE & UPDATE đều giống nhau)
            }
          })
          : []
      }

      if (isNew) {
        return createRecipe(payload)
      }

      return updateRecipe({
        vars: { id: modalDetailId },
        payload
      })
    })
  }


  /* ================= FOOTER ================= */
  const footer = (
    <ModalFooterContainer
      array={[
        <>
          <ButtonCancel onClick={handleCancel} />
          <ButtonConfirm
            htmlType="button"
            disabled={!isFormDirty}
            isLoading={loadingCreate || loadingUpdate}
            onClick={onSubmit}
          />
        </>
      ]}
    />
  )

  return (
    <ModalContainer
      title={title}
      footer={footer}
      onCancel={handleCancel}
      destroyOnClose
      width={900}
    >
      <Form
        layout="vertical"
        form={form}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
      >
        {/* ================= BASIC INFO ================= */}
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <TextInput size="large" />
        </Form.Item>

        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
          <Select size="large" data={mealTypes} keyItem="id" valueItem="id" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextInput size="large" />
        </Form.Item>

        {/* ================= TIME ================= */}
        <Form.Item label="Time" name="time" rules={[{ required: true }]}>
          <TimePicker size="large" format="HH:mm" className="w-full" />
        </Form.Item>

        {/* ================= MACROS ================= */}
        <div className="grid grid-cols-4 gap-4">
          <Form.Item label="kcal" name="kcal" rules={[{ required: true }]}>
            <NumberInput min={0} />
          </Form.Item>
          <Form.Item label="Protein" name="proteins" rules={[{ required: true }]}>
            <NumberInput min={0} />
          </Form.Item>
          <Form.Item label="Carbs" name="carbs" rules={[{ required: true }]}>
            <NumberInput min={0} />
          </Form.Item>
          <Form.Item label="Fats" name="fats" rules={[{ required: true }]}>
            <NumberInput min={0} />
          </Form.Item>
        </div>


        {/* ================= INGREDIENTS ================= */}
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Ingredients</h3>
                <ButtonAdd text="+ Add Ingredient" onClick={() => add({ gram: 0 })} />
              </div>

              {fields.map(({ key, name }, index) => (
                <div
                  key={key}
                  className="relative p-4 mb-3 border rounded-lg 
                     bg-[rgba(255,255,255,0.02)] 
                     hover:bg-[rgba(255,255,255,0.04)] transition"
                >
                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => remove(name)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-400"
                  >
                    ✕
                  </button>

                  {/* Header */}
                  <div className="mb-3 text-sm font-medium text-gray-300">
                    Ingredient {index + 1}
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-12 gap-4">
                    <Form.Item
                      label="Name"
                      name={[name, 'name']}
                      className="col-span-3"
                      rules={[{ required: true }]}
                    >
                      <Select data={ingredientOptions} keyItem="id" valueItem="id" />
                    </Form.Item>

                    <Form.Item
                      label="Quantity"
                      name={[name, 'quantity']}
                      className="col-span-3"
                      rules={[{ required: true }]}
                    >
                      <TextInput />
                    </Form.Item>

                    <Form.Item
                      label="Gram (g)"
                      name={[name, 'gram']}
                      className="col-span-2"
                      rules={[{ required: true }]}
                    >
                      <NumberInput min={0} addonAfter="g" />
                    </Form.Item>

                    <Form.Item
                      label="Description"
                      name={[name, 'description']}
                      className="col-span-4"
                    >
                      <TextInput placeholder="Optional" />
                    </Form.Item>
                  </div>
                </div>
              ))}
            </>
          )}
        </Form.List>

        {/* ================= INSTRUCTIONS ================= */}
        <Form.List name="instructions">
          {(fields, { add, remove }) => (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Instructions</h3>
                <ButtonAdd text="+ Add Step" onClick={() => add('')} />
              </div>

              {fields.map(({ key, name }, index) => (
                <div
                  key={key}
                  className="relative p-4 border rounded-lg mb-3 bg-[rgba(255,255,255,0.02)]"
                >
                  {/* Step label */}
                  <div className="mb-2 text-sm font-medium text-gray-300">
                    Step {index + 1}
                  </div>

                  {/* Input */}
                  <Form.Item
                    name={name}
                    className="mb-0"
                    rules={[{ required: true, message: 'Instruction is required' }]}
                  >
                    <TextInput placeholder="Describe this step..." />
                  </Form.Item>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => remove(name)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </>
          )}
        </Form.List>

      </Form>
    </ModalContainer>
  )
}

export default ModalDetail
