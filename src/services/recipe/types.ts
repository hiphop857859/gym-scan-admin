export type RecipeIngredient = {
  name: string
  quantity: string
  description?: string | null
}

export type RecipeDetail = {
  id: string
  name: string
  type: string
  description: string
  time: string
  kcal: number
  proteins: number
  carbs: number
  fats: number
  tags: string[]
  ingredients: RecipeIngredient[]
  instructions: string[]
  createdAt: string
  updatedAt: string
}

export type RecipePayload = {
  name: string
  type: string
  description?: string
  time?: string
  kcal?: number
  proteins?: number
  carbs?: number
  fats?: number
  tags?: string[]
  ingredients?: RecipeIngredient[]
  instructions?: string[]
}

export type RecipeList = {
  total: number
  items: RecipeDetail[]
}
