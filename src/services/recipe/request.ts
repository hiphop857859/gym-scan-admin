import { PageParams, Vars } from 'src/types'
import { API } from '../api.service'
import { RecipePayload, RecipeDetail, RecipeList } from './types'

export const recipeService = {
  // LIST
  getRecipes: (params: PageParams & { search?: string; type?: string; sorts?: string }) =>
    API.GET<RecipeList>(API.recipe, { params }),

  // CREATE
  createRecipe: (payload: RecipePayload) => API.POST<RecipeDetail>(API.recipe, { payload }),
  // src/services/index.ts
  getIngredientLibrary: () => API.GET<any>(API.ingredientLibrary, {}),

  // DETAIL
  getRecipeDetail: (vars: Vars) => API.GET<RecipeDetail>(API.recipeId, { vars }),

  // UPDATE
  updateRecipe: (data: any) => {
    console.log('CALLING UPDATE WITH:', {
      vars: data.vars,
      payload: data.payload
    })

    return API.PUT(API.recipeId, {
      vars: { vars: data.vars },
      payload: data.payload
    })
  },

  deleteRecipe: (data: { vars: Vars }) =>
    API.DELETE<RecipeDetail>(API.recipeId, {
      vars: data.vars
    })
}
