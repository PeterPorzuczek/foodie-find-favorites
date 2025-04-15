
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Recipe } from '@/utils/api';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onFavoriteToggle: (recipe: Recipe) => void;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, isFavorite, onFavoriteToggle, onClick }: RecipeCardProps) => {
  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="relative overflow-hidden aspect-video cursor-pointer" onClick={() => onClick(recipe)}>
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        {(recipe.vegetarian || recipe.vegan || recipe.glutenFree) && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {recipe.vegetarian && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Vegetarian</Badge>}
            {recipe.vegan && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Vegan</Badge>}
            {recipe.glutenFree && <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Gluten-Free</Badge>}
          </div>
        )}
      </div>
      <CardHeader className="p-3 pb-0 cursor-pointer" onClick={() => onClick(recipe)}>
        <CardTitle className="text-lg line-clamp-2 h-12">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm flex-grow">
        <div className="flex items-center gap-4">
          {recipe.readyInMinutes && (
            <div className="flex items-center">
              <span className="text-gray-600">
                {recipe.readyInMinutes} min
              </span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center">
              <span className="text-gray-600">
                {recipe.servings} servings
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "px-2 gap-1 hover:bg-transparent", 
            isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(recipe);
          }}
        >
          <Heart 
            className={cn("h-5 w-5", isFavorite ? "fill-current" : "")} 
          />
          {isFavorite ? 'Saved' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
