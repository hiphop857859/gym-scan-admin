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
      if (
        ing?.name &&
        !baseOptions.find((opt) => opt.id === ing.name)
      ) {
        baseOptions.push({
          id: ing.name,
          name: ing.name
        })
      }
    })

    return baseOptions
  }, [ingredientLibrary, selectedType])


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
  useQuery({
    func: Service.getRecipeDetail,
    isQuery: !isNew,
    params: { id: modalDetailId },
    onSuccess: (res) => {
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
        instructions: res.instructions?.join('\n'),
        ingredients: res.ingredients
      })
    }
  })

  /* ================= SUBMIT ================= */
  const onSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        time: values.time ? values.time.format('HH:mm') : null,
        tags: values.tags
          ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [],
        instructions: values.instructions
          ? values.instructions.split('\n').map((i: string) => i.trim()).filter(Boolean)
          : [],
        ingredients: Array.isArray(values.ingredients) ? values.ingredients : []
      }

      if (isNew) return createRecipe(payload)

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
          <TextInput size="large" placeholder="Recipe name" />
        </Form.Item>

        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
          <Select size="large" data={mealTypes} keyItem="id" valueItem="id" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextInput size="large" placeholder="Short description" />
        </Form.Item>

        {/* ================= TIME ================= */}
        <Form.Item
          label="Time"
          name="time"
          rules={[{ required: true, message: 'Please select time' }]}
        >
          <TimePicker
            size="large"
            format="HH:mm"
            use12Hours={false}
            className="w-full"
            minuteStep={5}
          />
        </Form.Item>

        {/* ================= MACROS ================= */}
        <div className="grid grid-cols-4 gap-4">
          <Form.Item label="kcal" name="kcal" rules={[{ required: true }]}>
            <NumberInput size="large" min={0} />
          </Form.Item>
          <Form.Item label="Protein" name="proteins" rules={[{ required: true }]}>
            <NumberInput size="large" min={0} />
          </Form.Item>
          <Form.Item label="Carbs" name="carbs" rules={[{ required: true }]}>
            <NumberInput size="large" min={0} />
          </Form.Item>
          <Form.Item label="Fats" name="fats" rules={[{ required: true }]}>
            <NumberInput size="large" min={0} />
          </Form.Item>
        </div>

        {/* ================= INGREDIENTS ================= */}
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Ingredients</h3>
                <ButtonAdd size="large" text="+ Add Ingredient" onClick={() => add({ gam: 0 })} />
              </div>

              {fields.map(({ key, name }) => (
                <div
                  key={key}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-md"
                >
                  <div className="grid grid-cols-12 gap-6 items-start">
                    {/* NAME */}
                    <div className="col-span-3">
                      <Form.Item
                        label="Name"
                        name={[name, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Select
                          size="large"
                          data={ingredientOptions}
                          keyItem="id"
                          valueItem="id"
                          disabled={!selectedType}
                          placeholder={
                            selectedType
                              ? 'Select ingredient'
                              : 'Please select recipe type first'
                          }
                        />
                      </Form.Item>
                    </div>

                    {/* QUANTITY */}
                    <div className="col-span-3">
                      <Form.Item
                        label="Quantity"
                        name={[name, 'quantity']}
                        rules={[{ required: true }]}
                      >
                        <TextInput size="large" />
                      </Form.Item>
                    </div>

                    {/* GRAM */}
                    <div className="col-span-2">
                      <Form.Item
                        label="Gram (g)"
                        name={[name, 'gam']}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value === undefined || value === null)
                                return Promise.reject(new Error('Required'))
                              if (value < 0)
                                return Promise.reject(new Error('Must be ≥ 0'))
                              return Promise.resolve()
                            }
                          }
                        ]}
                      >
                        <NumberInput
                          size="medium"
                          min={0}
                          precision={0}
                          placeholder="0"
                          addonAfter="g"
                        />
                      </Form.Item>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="col-span-3">
                      <Form.Item label="Description" name={[name, 'description']}>
                        <TextInput size="large" />
                      </Form.Item>
                    </div>

                    {/* REMOVE */}
                    <div className="col-span-1 flex items-center justify-end mt-7">
                      <button
                        type="button"
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

        {/* ================= INSTRUCTIONS ================= */}
        <Form.Item
          label="Instructions (each step on a new line)"
          name="instructions"
          rules={[{ required: true }]}
        >
          <TextArea size="large" rows={6} placeholder="Step 1\nStep 2\nStep 3..." />
        </Form.Item>
      </Form>
    </ModalContainer>
  )
}

export default ModalDetail
