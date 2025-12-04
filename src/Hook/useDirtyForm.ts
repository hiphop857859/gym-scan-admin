import { useState } from 'react'
import { Form, FormInstance } from 'antd'
// import { isEqual } from 'src/helpers/lodash'

// function clearUndefinedKeys<T extends Record<string, any>>(obj: T): T | undefined {
//   if (typeof obj !== 'object' || obj === null || obj === undefined) return obj

//   const cleanedObj = Object.fromEntries(
//     Object.entries(obj)
//       .map(([key, value]) => [key, clearUndefinedKeys(value)])
//       .filter(([, value]) => value !== undefined && !(typeof value === 'object' && Object.keys(value).length === 0)) // Remove empty objects
//   ) as T

//   return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined
// }

// export function useDirtyForm<T extends Record<string, any>>(form: FormInstance<T>) {
export function useDirtyForm<T extends Record<string, any>>(form: FormInstance<T>) {
  const [, setInitialValues] = useState<T>({} as T)

  const currentValues = Form.useWatch([], form) as T

  // const isFormDirty = !isEqual(currentValues, initialValues)

  return { setInitialValues, isFormDirty: true }
}
