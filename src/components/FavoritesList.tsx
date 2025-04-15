
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Recipe } from '@/utils/api';

interface FavoritesListProps {
  favorites: Recipe[];
  onFavoriteRemove: (recipeId: number) => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

const FavoritesList = ({ favorites, onFavoriteRemove, onRecipeSelect }: FavoritesListProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Heart className="h-4 w-4" />
            Favorites
            {favorites.length > 0 && (
              <span className="ml-1 bg-orange-100 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {favorites.length}
              </span>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Favorite Recipes</DrawerTitle>
            </DrawerHeader>
            <FavoritesContent 
              favorites={favorites} 
              onFavoriteRemove={onFavoriteRemove} 
              onRecipeSelect={(recipe) => {
                onRecipeSelect(recipe);
                setOpen(false);
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1">
          <Heart className="h-4 w-4" />
          Favorites
          {favorites.length > 0 && (
            <span className="ml-1 bg-orange-100 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {favorites.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Favorite Recipes</DialogTitle>
        </DialogHeader>
        <FavoritesContent 
          favorites={favorites} 
          onFavoriteRemove={onFavoriteRemove} 
          onRecipeSelect={(recipe) => {
            onRecipeSelect(recipe);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

const FavoritesContent = ({ 
  favorites, 
  onFavoriteRemove, 
  onRecipeSelect 
}: FavoritesListProps) => {
  if (favorites.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="mb-2">
          <Heart className="h-12 w-12 mx-auto text-gray-300" />
        </div>
        <p>You haven't saved any recipes yet</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[50vh] p-4">
      <div className="space-y-2">
        {favorites.map(recipe => (
          <div 
            key={recipe.id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
          >
            <div 
              className="w-16 h-16 rounded overflow-hidden flex-shrink-0 cursor-pointer"
              onClick={() => onRecipeSelect(recipe)}
            >
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow cursor-pointer" onClick={() => onRecipeSelect(recipe)}>
              <h4 className="font-medium text-sm line-clamp-2">{recipe.title}</h4>
              {recipe.readyInMinutes && (
                <p className="text-xs text-gray-500">{recipe.readyInMinutes} min</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 flex-shrink-0 h-8 w-8"
              onClick={() => onFavoriteRemove(recipe.id)}
            >
              <Heart className="h-4 w-4 fill-current" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FavoritesList;
