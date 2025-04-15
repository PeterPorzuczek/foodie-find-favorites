
import { useEffect, useState } from 'react';

export type Diet = 'vegetarian' | 'vegan' | 'gluten free' | 'ketogenic' | 'pescetarian' | 'paleo' | '';
export type Intolerance = 'dairy' | 'egg' | 'gluten' | 'grain' | 'peanut' | 'seafood' | 'sesame' | 'shellfish' | 'soy' | 'sulfite' | 'tree nut' | 'wheat' | '';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: Ingredient[];
  usedIngredients?: Ingredient[];
  unusedIngredients?: Ingredient[];
  likes: number;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  veryHealthy?: boolean;
}

export interface Ingredient {
  id: number;
  amount: number;
  unit: string;
  unitLong: string;
  unitShort: string;
  aisle: string;
  name: string;
  original: string;
  originalName: string;
  meta: string[];
  extendedName?: string;
  image: string;
}

export interface RecipeDetail extends Recipe {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number;
  cookingMinutes: number;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: Ingredient[];
  summary: string;
  instructions: string;
  analyzedInstructions: any[];
  diets: string[];
}

export interface SearchParams {
  ingredients?: string;
  query?: string;
  diet?: Diet;
  intolerances?: Intolerance[];
  maxReadyTime?: number;
  sort?: string;
  sortDirection?: string;
  number?: number;
  offset?: number;
}

export const useSpoonacular = (apiKey: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const baseUrl = 'https://api.spoonacular.com';
  
  const searchRecipesByIngredients = async (ingredients: string, number = 12): Promise<Recipe[]> => {
    if (!apiKey) {
      setError('API key is required');
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${baseUrl}/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=${number}&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const searchRecipes = async (params: SearchParams): Promise<{ results: Recipe[], totalResults: number }> => {
    if (!apiKey) {
      setError('API key is required');
      return { results: [], totalResults: 0 };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('query', params.query);
      if (params.ingredients) queryParams.append('includeIngredients', params.ingredients);
      if (params.diet) queryParams.append('diet', params.diet);
      if (params.intolerances && params.intolerances.length > 0) 
        queryParams.append('intolerances', params.intolerances.join(','));
      if (params.maxReadyTime) queryParams.append('maxReadyTime', params.maxReadyTime.toString());
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.number) queryParams.append('number', params.number.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      
      queryParams.append('apiKey', apiKey);
      
      const response = await fetch(`${baseUrl}/recipes/complexSearch?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return { results: [], totalResults: 0 };
    } finally {
      setIsLoading(false);
    }
  };
  
  const getRecipeDetail = async (id: number): Promise<RecipeDetail | null> => {
    if (!apiKey) {
      setError('API key is required');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${baseUrl}/recipes/${id}/information?apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    searchRecipesByIngredients,
    searchRecipes,
    getRecipeDetail
  };
};
