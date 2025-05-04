
import { useState, useEffect } from 'react';
import { CookingPot, UtensilsCrossed } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import ApiKeyInput from '@/components/ApiKeyInput';
import SearchBar from '@/components/SearchBar';
import FilterBar, { Filters } from '@/components/FilterBar';
import RecipeList from '@/components/RecipeList';
import RecipeDetail from '@/components/RecipeDetail';
import FavoritesList from '@/components/FavoritesList';

import { Recipe, RecipeDetail as RecipeDetailType, useSpoonacular, SearchParams } from '@/utils/api';
import useLocalStorage from '@/hooks/useLocalStorage';

const defaultFilters: Filters = {
  diet: '',
  intolerances: [],
  maxReadyTime: null
};

const Index = () => {
  // API Key State
  const [apiKey] = useLocalStorage<string | null>('spoonacular-api-key', null);
  const { isLoading, error, searchRecipes, searchRecipesByIngredients, getRecipeDetail } = useSpoonacular(apiKey);
  
  // Search & Filter State
  const [searchMode, setSearchMode] = useState<'recipe' | 'ingredient'>('recipe');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  
  // Recipe State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetailType | null>(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  
  // Favorites State
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [favoritesMap, setFavoritesMap] = useState<Record<number, Recipe>>({});
  
  // View State
  const [activeView, setActiveView] = useState<'search' | 'favorites'>('search');
  
  // Initialize favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('recipe-favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
        
        // Create map for faster lookup
        const map: Record<number, Recipe> = {};
        parsed.forEach((recipe: Recipe) => {
          map[recipe.id] = recipe;
        });
        setFavoritesMap(map);
      } catch (e) {
        console.error('Error parsing favorites:', e);
      }
    }
  }, []);
  
  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('recipe-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const handleSearch = async (query: string) => {
    if (!apiKey || !query.trim()) return;
    
    setSearchQuery(query);
    setActiveView('search');
    
    try {
      if (searchMode === 'ingredient') {
        const data = await searchRecipesByIngredients(query);
        setRecipes(data);
      } else {
        const params: SearchParams = {
          query,
          diet: filters.diet,
          intolerances: filters.intolerances,
          maxReadyTime: filters.maxReadyTime || undefined,
          number: 12
        };
        
        const data = await searchRecipes(params);
        setRecipes(data.results);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };
  
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    
    // If there's an active search query, re-search with new filters
    if (searchQuery && searchMode === 'recipe') {
      handleSearch(searchQuery);
    }
  };
  
  const handleRecipeSelect = async (recipe: Recipe) => {
    if (!apiKey) return;
    
    try {
      const detailedRecipe = await getRecipeDetail(recipe.id);
      if (detailedRecipe) {
        setSelectedRecipe(detailedRecipe);
        setShowRecipeDetail(true);
      }
    } catch (err) {
      console.error('Error fetching recipe details:', err);
    }
  };
  
  const handleFavoriteToggle = (recipe: Recipe) => {
    if (favoritesMap[recipe.id]) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(fav => fav.id !== recipe.id);
      setFavorites(updatedFavorites);
      
      const updatedMap = {...favoritesMap};
      delete updatedMap[recipe.id];
      setFavoritesMap(updatedMap);
    } else {
      // Add to favorites
      const updatedFavorites = [...favorites, recipe];
      setFavorites(updatedFavorites);
      
      const updatedMap = {...favoritesMap};
      updatedMap[recipe.id] = recipe;
      setFavoritesMap(updatedMap);
    }
  };
  
  const handleFavoriteRemove = (recipeId: number) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
    setFavorites(updatedFavorites);
    
    const updatedMap = {...favoritesMap};
    delete updatedMap[recipeId];
    setFavoritesMap(updatedMap);
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CookingPot className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">Foodie Find</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <FavoritesList 
              favorites={favorites} 
              onFavoriteRemove={handleFavoriteRemove}
              onRecipeSelect={handleRecipeSelect}
            />
            
            <Button 
              variant="ghost" 
              className="text-gray-600"
              onClick={() => {
                document.getElementById('api-key-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              API Key
            </Button>
          </div>
        </div>
      </header>
      
      {/* Search Section */}
      <section className="bg-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Find Your Next Favorite Recipe</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search by recipe name or ingredients to discover delicious meals tailored to your preferences.
            </p>
          </div>
          
          {!apiKey ? (
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-xl mx-auto text-center">
              <UtensilsCrossed className="h-12 w-12 text-orange-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">API Key Required</h3>
              <p className="text-gray-600 mb-4">
                Please add your Spoonacular API key below to start searching for recipes.
              </p>
              <Button 
                onClick={() => {
                  document.getElementById('api-key-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Add API Key
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <Tabs 
                defaultValue="recipe" 
                value={searchMode} 
                onValueChange={(v) => setSearchMode(v as 'recipe' | 'ingredient')}
                className="w-full max-w-3xl"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recipe">Search by Recipe</TabsTrigger>
                  <TabsTrigger value="ingredient">Search by Ingredients</TabsTrigger>
                </TabsList>
                <TabsContent value="recipe" className="pt-4">
                  <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Search for recipes (e.g., pasta, chocolate cake)..." 
                  />
                </TabsContent>
                <TabsContent value="ingredient" className="pt-4">
                  <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Enter ingredients (e.g., chicken, rice, tomatoes)..." 
                  />
                </TabsContent>
              </Tabs>
              
              {searchMode === 'recipe' && (
                <FilterBar onFilterChange={handleFilterChange} activeFilters={filters} />
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Results & Favorites Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {(apiKey && (searchQuery || favorites.length > 0)) && (
            <Tabs 
              defaultValue={activeView} 
              value={activeView}
              onValueChange={(v) => setActiveView(v as 'search' | 'favorites')}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  {activeView === 'search' && searchQuery ? 
                    `${searchMode === 'recipe' ? 'Recipe' : 'Ingredient'} Results: "${searchQuery}"` : 
                    'My Favorite Recipes'}
                </h2>
                <TabsList>
                  <TabsTrigger value="search" disabled={!searchQuery}>Search Results</TabsTrigger>
                  <TabsTrigger value="favorites" disabled={favorites.length === 0}>
                    Favorites ({favorites.length})
                  </TabsTrigger>
                </TabsList>
              </div>
              <Separator className="mb-8" />
              
              <TabsContent value="search">
                <RecipeList 
                  recipes={recipes} 
                  favorites={Object.keys(favoritesMap).map(Number)}
                  isLoading={isLoading} 
                  error={error} 
                  onFavoriteToggle={handleFavoriteToggle}
                  onRecipeSelect={handleRecipeSelect}
                />
              </TabsContent>
              
              <TabsContent value="favorites">
                {favorites.length > 0 ? (
                  <RecipeList 
                    recipes={favorites}
                    favorites={Object.keys(favoritesMap).map(Number)}
                    isLoading={false}
                    error={null}
                    onFavoriteToggle={handleFavoriteToggle}
                    onRecipeSelect={handleRecipeSelect}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No favorite recipes yet. Start by saving some recipes!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {(!apiKey || (!searchQuery && favorites.length === 0)) && (
            <div className="text-center py-12 text-gray-500">
              {apiKey ? 'Search for recipes to get started!' : 'Add your API key to start exploring recipes.'}
            </div>
          )}
          
          {selectedRecipe && (
            <RecipeDetail 
              recipe={selectedRecipe}
              isOpen={showRecipeDetail}
              isFavorite={!!favoritesMap[selectedRecipe.id]}
              onClose={() => setShowRecipeDetail(false)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </div>
      </section>
      
      {/* API Key Section */}
      <section id="api-key-section" className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">Spoonacular API Key</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              To use this app, you need a free Spoonacular API key. Your key is stored locally and never sent to our servers.
            </p>
          </div>
          
          <ApiKeyInput />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">
            Recipe data powered by{' '}
            <a 
              href="https://spoonacular.com/food-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300"
            >
              Spoonacular API
            </a>
          </p>
          <p className="text-sm text-gray-500">
            This app stores your API key and favorites in your browser's local storage.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
