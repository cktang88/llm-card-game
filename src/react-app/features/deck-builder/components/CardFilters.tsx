import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Label } from '../../../../components/ui/label';
import { useDeckBuilderStore } from '../../../store/deckBuilderStore';

const RARITIES = ['common', 'uncommon', 'rare', 'legendary'];
const DAMAGE_TYPES = ['health', 'morale', 'both'];
const DELAYS = [0, 1, 2, 3, 4];

export const CardFilters: React.FC = () => {
  const {
    searchQuery,
    selectedRarities,
    selectedDelays,
    selectedTypes,
    setSearchQuery,
    toggleRarity,
    toggleDelay,
    toggleType,
    clearFilters,
  } = useDeckBuilderStore();

  const hasActiveFilters = searchQuery || selectedRarities.length > 0 || 
    selectedDelays.length > 0 || selectedTypes.length > 0;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label className="text-gray-400 text-sm mb-2">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Card name..."
              className="bg-gray-700 border-gray-600 text-white pl-10"
            />
          </div>
        </div>

        {/* Delay Filter */}
        <div>
          <Label className="text-gray-400 text-sm mb-2">Delay</Label>
          <div className="flex flex-wrap gap-2">
            {DELAYS.map(delay => (
              <button
                key={delay}
                onClick={() => toggleDelay(delay)}
                className={`w-10 h-10 rounded flex items-center justify-center font-bold transition-colors ${
                  selectedDelays.includes(delay)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {delay}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity Filter */}
        <div>
          <Label className="text-gray-400 text-sm mb-2">Rarity</Label>
          <div className="space-y-2">
            {RARITIES.map(rarity => (
              <div key={rarity} className="flex items-center space-x-2">
                <Checkbox
                  id={`rarity-${rarity}`}
                  checked={selectedRarities.includes(rarity)}
                  onCheckedChange={() => toggleRarity(rarity)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label
                  htmlFor={`rarity-${rarity}`}
                  className={`text-sm cursor-pointer capitalize ${
                    rarity === 'common' ? 'text-gray-400' :
                    rarity === 'uncommon' ? 'text-green-400' :
                    rarity === 'rare' ? 'text-blue-400' :
                    'text-purple-400'
                  }`}
                >
                  {rarity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Damage Type Filter */}
        <div>
          <Label className="text-gray-400 text-sm mb-2">Damage Type</Label>
          <div className="space-y-2">
            {DAMAGE_TYPES.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label
                  htmlFor={`type-${type}`}
                  className="text-sm text-gray-300 cursor-pointer capitalize"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};