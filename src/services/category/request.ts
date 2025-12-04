import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { Categories, CategoryDetail, CategoryPayload } from './types'
import { AxiosRequestConfig } from 'axios'

export const categoryService = {
  getCategories: (params: PageParams, config?: AxiosRequestConfig) =>
    API.GET<Categories>(API.categories, { params }, config),
  createCategory: (payload: CategoryPayload) => API.POST<CategoryDetail>(API.categories, { payload }),

  getCategory: (vars: Vars) => API.GET<CategoryDetail>(API.categoryId, { vars }),

  updateCategory: (data: { vars: Vars; payload: Partial<CategoryPayload> }) =>
    API.PUT<CategoryDetail>(API.categoryId, data),

  deleteCategory: (data: { vars: Vars }) => API.DELETE<CategoryDetail>(API.categoryId, data)
}
