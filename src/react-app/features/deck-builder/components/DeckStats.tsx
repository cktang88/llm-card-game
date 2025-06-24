import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Heart, Brain, Clock } from 'lucide-react';
import { calculateDeckStats } from '../utils/deckStats';
import { Card as UnitCard } from '../../../../game/models/Unit';

interface DeckStatsProps {
  cards: UnitCard[];
}

export const DeckStats: React.FC<DeckStatsProps> = ({ cards }) => {
  const stats = calculateDeckStats(cards);

  const StatItem: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: string | number; 
    color?: string;
  }> = ({ icon, label, value, color = 'text-gray-400' }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Deck Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <StatItem
          icon={<Clock className="w-4 h-4" />}
          label="Average Delay"
          value={stats.averageDelay.toFixed(2)}
          color="text-yellow-500"
        />
        <StatItem
          icon={<Heart className="w-4 h-4" />}
          label="Average Health"
          value={stats.averageHealth.toFixed(1)}
          color="text-red-500"
        />
        <StatItem
          icon={<Brain className="w-4 h-4" />}
          label="Average Morale"
          value={stats.averageMorale.toFixed(1)}
          color="text-blue-500"
        />

        {/* Damage Type Distribution */}
        <div className="pt-3 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Damage Types</h4>
          <div className="space-y-1">
            {Object.entries(stats.typeDistribution).map(([type, count]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-gray-400 capitalize">{type}</span>
                <span className="text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rarity Distribution */}
        <div className="pt-3 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Rarity</h4>
          <div className="space-y-1">
            {Object.entries(stats.rarityDistribution)
              .sort((a, b) => {
                const order = ['common', 'uncommon', 'rare', 'legendary'];
                return order.indexOf(a[0]) - order.indexOf(b[0]);
              })
              .map(([rarity, count]) => (
                <div key={rarity} className="flex justify-between text-sm">
                  <span className={`capitalize ${
                    rarity === 'common' ? 'text-gray-400' :
                    rarity === 'uncommon' ? 'text-green-400' :
                    rarity === 'rare' ? 'text-blue-400' :
                    'text-purple-400'
                  }`}>
                    {rarity}
                  </span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};