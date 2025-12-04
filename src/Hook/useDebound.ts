// import { useState, useEffect } from 'react'

// export const useDebounce = <T>(initialValue: T, time: number): [T, T, React.Dispatch<T>] => {
//   const [value, setValue] = useState<T>(initialValue)
//   const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)
//   useEffect(() => {
//     setDebouncedValue(value)
//   }, [value])
//   return [debouncedValue, value, setValue]
// }
