
import { CookingPot } from 'lucide-react';
import { Recipe } from '@/utils/api';
import RecipeCard from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  favorites: number[];
  isLoading: boolean;
  error: string | null;
  onFavoriteToggle: (recipe: Recipe) => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-gray-100 rounded-md overflow-hidden">
        <div className="aspect-video bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <CookingPot className="h-16 w-16 mx-auto text-gray-300 mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes found</h3>
    <p className="text-gray-500 max-w-md mx-auto">
      Try adjusting your search or filters to find something delicious!
    </p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <div className="mb-4 text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16 mx-auto">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h3>
    <p className="text-gray-500 max-w-md mx-auto">
      {message || "There was an error fetching recipes. Please try again."}
    </p>
  </div>
);

const RecipeList = ({ 
  recipes, 
  favorites,
  isLoading, 
  error, 
  onFavoriteToggle, 
  onRecipeSelect 
}: RecipeListProps) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState message={error} />;
  }
  
  if (recipes.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          onFavoriteToggle={onFavoriteToggle}
          onClick={onRecipeSelect}
        />
      ))}
    </div>
  );
};

export default RecipeList;
