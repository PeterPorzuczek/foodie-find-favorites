
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import useLocalStorage from '@/hooks/useLocalStorage';

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useLocalStorage<string | null>('spoonacular-api-key', null);
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setApiKey(tempApiKey.trim() || null);
  };

  const handleClear = () => {
    setTempApiKey('');
    setApiKey(null);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Spoonacular API Key</CardTitle>
        <CardDescription>
          Enter your Spoonacular API key to access recipe search functionality.
          {!apiKey && (
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <AlertDescription>
                You'll need a Spoonacular API key to use this app. You can get one for free at{' '}
                <a 
                  href="https://spoonacular.com/food-api/console#Dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4 hover:text-amber-600 inline-flex items-center"
                >
                  spoonacular.com
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </AlertDescription>
            </Alert>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="Enter your Spoonacular API key"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="pr-24"
            />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 text-xs"
            >
              {showKey ? 'Hide' : 'Show'}
            </Button>
          </div>
          {apiKey && (
            <p className="text-sm text-green-600">API key is set and ready to use!</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleClear}>
          Clear Key
        </Button>
        <Button onClick={handleSave}>Save Key</Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
