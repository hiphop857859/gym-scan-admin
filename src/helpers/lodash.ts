export const Pick = <T extends object, key extends keyof T>(object: T, arrayKey: Array<key>): T => {
  return arrayKey.reduce((acc: T, curr: key) => {
    acc[curr] = object[curr]
    return acc
  }, {} as T)
}

export const isEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true // Direct equality check
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false // Different number of keys

  return keys1.every((key) => isEqual(obj1[key], obj2[key]))
}
