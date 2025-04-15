
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Clock, Users, ExternalLink } from "lucide-react";
import { RecipeDetail as RecipeDetailType } from '@/utils/api';
import { cn } from '@/lib/utils';

interface RecipeDetailProps {
  recipe: RecipeDetailType | null;
  isOpen: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onFavoriteToggle: (recipe: RecipeDetailType) => void;
}

const RecipeDetail = ({ recipe, isOpen, isFavorite, onClose, onFavoriteToggle }: RecipeDetailProps) => {
  const [activeTab, setActiveTab] = useState('ingredients');
  
  if (!recipe) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative mb-4 overflow-hidden rounded-md aspect-video">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex justify-between items-start gap-4">
            <DialogTitle className="text-2xl font-bold">{recipe.title}</DialogTitle>
            <Button 
              variant="outline" 
              size="icon" 
              className={cn(
                isFavorite ? "text-red-500 border-red-200" : "text-gray-500"
              )}
              onClick={() => onFavoriteToggle(recipe)}
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-current" : "")} />
            </Button>
          </div>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.vegetarian && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Vegetarian</Badge>}
              {recipe.vegan && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Vegan</Badge>}
              {recipe.glutenFree && <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Gluten-Free</Badge>}
              {recipe.dairyFree && <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Dairy-Free</Badge>}
              {recipe.veryHealthy && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Healthy</Badge>}
            </div>
            
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{recipe.readyInMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{recipe.servings} servings</span>
              </div>
              {recipe.sourceUrl && (
                <a 
                  href={recipe.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Original
                </a>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="my-4" />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="ingredients" className="flex-1">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions" className="flex-1">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="mt-4 focus:outline-none">
            <ul className="space-y-2">
              {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-orange-500"></div>
                  <span>
                    <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="instructions" className="mt-4 focus:outline-none">
            {recipe.instructions ? (
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            ) : (
              <p>No instructions available. Please check the original recipe link.</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetail;
