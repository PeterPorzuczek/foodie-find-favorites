
import { useState } from 'react';
import { Check, ChevronDown, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Diet, Intolerance } from '@/utils/api';

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  activeFilters: Filters;
}

export interface Filters {
  diet: Diet;
  intolerances: Intolerance[];
  maxReadyTime: number | null;
}

const dietOptions: { value: Diet; label: string }[] = [
  { value: '', label: 'Any' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten free', label: 'Gluten Free' },
  { value: 'ketogenic', label: 'Ketogenic' },
  { value: 'pescetarian', label: 'Pescetarian' },
  { value: 'paleo', label: 'Paleo' }
];

const intoleranceOptions: { value: Intolerance; label: string }[] = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'egg', label: 'Egg' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'grain', label: 'Grain' },
  { value: 'peanut', label: 'Peanut' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'soy', label: 'Soy' },
  { value: 'sulfite', label: 'Sulfite' },
  { value: 'tree nut', label: 'Tree Nut' },
  { value: 'wheat', label: 'Wheat' }
];

const timeOptions = [
  { value: 15, label: '15 minutes or less' },
  { value: 30, label: '30 minutes or less' },
  { value: 60, label: '60 minutes or less' }
];

const FilterBar = ({ onFilterChange, activeFilters }: FilterBarProps) => {
  const [localFilters, setLocalFilters] = useState<Filters>(activeFilters);
  
  const activeFilterCount = 
    (activeFilters.diet ? 1 : 0) + 
    activeFilters.intolerances.length +
    (activeFilters.maxReadyTime ? 1 : 0);
  
  const handleDietChange = (diet: Diet) => {
    const updatedFilters = { ...localFilters, diet };
    setLocalFilters(updatedFilters);
  };
  
  const handleIntoleranceChange = (value: Intolerance) => {
    const updatedIntolerances = localFilters.intolerances.includes(value)
      ? localFilters.intolerances.filter(i => i !== value)
      : [...localFilters.intolerances, value];
    
    const updatedFilters = { ...localFilters, intolerances: updatedIntolerances };
    setLocalFilters(updatedFilters);
  };
  
  const handleTimeChange = (maxReadyTime: number | null) => {
    const updatedFilters = { ...localFilters, maxReadyTime };
    setLocalFilters(updatedFilters);
  };
  
  const applyFilters = () => {
    onFilterChange(localFilters);
  };
  
  const clearFilters = () => {
    const resetFilters: Filters = {
      diet: '',
      intolerances: [],
      maxReadyTime: null
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 h-10">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-800 hover:bg-orange-200">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Diet</h3>
              <div className="grid grid-cols-2 gap-2">
                {dietOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={localFilters.diet === option.value ? "default" : "outline"}
                    className="justify-start h-8 px-2"
                    onClick={() => handleDietChange(option.value)}
                  >
                    {localFilters.diet === option.value && (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Intolerances</h3>
              <div className="grid grid-cols-2 gap-2">
                {intoleranceOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`intolerance-${option.value}`} 
                      checked={localFilters.intolerances.includes(option.value)}
                      onCheckedChange={() => handleIntoleranceChange(option.value)}
                    />
                    <Label htmlFor={`intolerance-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Ready In</h3>
              <div className="grid grid-cols-1 gap-2">
                {timeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={localFilters.maxReadyTime === option.value ? "default" : "outline"}
                    className="justify-start h-8"
                    onClick={() => handleTimeChange(option.value)}
                  >
                    {localFilters.maxReadyTime === option.value && (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    {option.label}
                  </Button>
                ))}
                <Button
                  variant={localFilters.maxReadyTime === null ? "default" : "outline"}
                  className="justify-start h-8"
                  onClick={() => handleTimeChange(null)}
                >
                  {localFilters.maxReadyTime === null && (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Any time
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {activeFilters.diet && (
        <Badge 
          variant="secondary" 
          className="bg-orange-100 text-orange-800 hover:bg-orange-200"
        >
          {dietOptions.find(d => d.value === activeFilters.diet)?.label}
          <button 
            className="ml-1" 
            onClick={() => {
              const newFilters: Filters = {...activeFilters, diet: ''};
              onFilterChange(newFilters);
              setLocalFilters(newFilters);
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {activeFilters.intolerances.map((intolerance) => (
        <Badge 
          key={intolerance}
          variant="secondary"
          className="bg-orange-100 text-orange-800 hover:bg-orange-200"
        >
          {intoleranceOptions.find(i => i.value === intolerance)?.label}
          <button 
            className="ml-1" 
            onClick={() => {
              const newFilters: Filters = {
                ...activeFilters, 
                intolerances: activeFilters.intolerances.filter(i => i !== intolerance)
              };
              onFilterChange(newFilters);
              setLocalFilters(newFilters);
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {activeFilters.maxReadyTime && (
        <Badge 
          variant="secondary"
          className="bg-orange-100 text-orange-800 hover:bg-orange-200"
        >
          Ready in {activeFilters.maxReadyTime} min or less
          <button 
            className="ml-1" 
            onClick={() => {
              const newFilters: Filters = {...activeFilters, maxReadyTime: null};
              onFilterChange(newFilters);
              setLocalFilters(newFilters);
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
};

export default FilterBar;
