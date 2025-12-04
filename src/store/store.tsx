/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer'
import { createContext, ReactNode, useContext, useReducer } from 'react'

type children<type> = {
  children: type
}

export function createStore<T>(initialState: T) {
  const StateContext = createContext<T>(initialState)
  const UpdateContext = createContext<(value: (_value: T) => void) => void>(() => {})
  const StoreProvider = ({ children }: children<ReactNode>) => {
    const [state, updateState] = useReducer(produce, initialState)

    return (
      <UpdateContext.Provider value={updateState}>
        <StateContext.Provider value={state as T}>{children}</StateContext.Provider>
      </UpdateContext.Provider>
    )
  }

  const useStore = (): [T, (value: (_value: T) => void) => void] => [
    useContext(StateContext),
    useContext(UpdateContext)
  ]
  return { Provider: StoreProvider, useStore }
}
