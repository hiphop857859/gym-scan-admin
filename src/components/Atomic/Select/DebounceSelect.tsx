import React from 'react'
import { Select, Spin } from 'antd'
import type { SelectProps } from 'antd'
import { useSearch } from 'src/Hook/useSearch'
import { AxiosRequestConfig } from 'axios'
import { PageParams, ResponseList } from 'src/types'

export interface DebounceSelectProps<TParams, ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (params: TParams, config?: AxiosRequestConfig) => Promise<ResponseList<any>>
  normalizeOptionsData?: (baseData: ValueType[], data: any) => ValueType[]
  searchParams?: Record<string, any>
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any>({
  fetchOptions,
  normalizeOptionsData = undefined,
  searchParams = {},
  ...props
}: DebounceSelectProps<PageParams, ValueType>) {
  const {
    triggerSearch,
    results: options,
    loading: isLoading
  } = useSearch({
    func: fetchOptions,
    ...(normalizeOptionsData ? { normalizationData: normalizeOptionsData } : {})
  })

  const onSearch = (search: string) =>
    triggerSearch({
      q: search,
      ...searchParams
    })

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={onSearch}
      notFoundContent={isLoading ? <Spin size='small' /> : null}
      {...props}
      options={options}
    />
  )
}

export default DebounceSelect
