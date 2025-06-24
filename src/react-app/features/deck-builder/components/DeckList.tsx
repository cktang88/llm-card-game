import React from 'react';
import { useDrop } from 'react-dnd';
import { Card } from '../../../../game/models/Unit';
import { useDeckBuilderStore } from '../../../store/deckBuilderStore';
import { Trash2, Save, Download, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';

interface DeckListProps {
  onLoadDeck?: () => void;
}

export const DeckList: React.FC<DeckListProps> = ({ onLoadDeck }) => {
  const {
    currentDeck,
    deckName,
    setDeckName,
    removeCardFromDeck,
    addCardToDeck,
    clearDeck,
    saveDeck,
  } = useDeckBuilderStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { card: Card }) => {
      addCardToDeck(item.card);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Group cards by ID for display
  const cardCounts = currentDeck.reduce((acc, card) => {
    acc[card.id] = (acc[card.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueCards = Array.from(new Set(currentDeck.map(c => c.id)))
    .map(id => currentDeck.find(c => c.id === id)!)
    .sort((a, b) => a.delay - b.delay || a.name.localeCompare(b.name));

  // Calculate deck statistics
  const totalCards = currentDeck.length;
  const averageDelay = currentDeck.length > 0
    ? currentDeck.reduce((sum, card) => sum + card.delay, 0) / currentDeck.length
    : 0;
  const delayDistribution = currentDeck.reduce((acc, card) => {
    acc[card.delay] = (acc[card.delay] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const isValidDeck = totalCards >= 20 && totalCards <= 30;

  return (
    <UICard
      ref={drop as any}
      className={`bg-gray-800 border-gray-700 h-full transition-all ${
        isOver ? 'border-blue-500 shadow-lg shadow-blue-500/20' : ''
      }`}
    >
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-white">Current Deck</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoadDeck}
              className="text-gray-400 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDeck}
              disabled={currentDeck.length === 0}
              className="text-gray-400 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Deck name..."
          />
          <Button
            onClick={saveDeck}
            disabled={!isValidDeck}
            variant={isValidDeck ? "default" : "secondary"}
            size="sm"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
        <div className="mt-3 space-y-1 text-sm">
          <div className={`flex items-center justify-between ${
            isValidDeck ? 'text-green-400' : 'text-orange-400'
          }`}>
            <span>Cards: {totalCards}/30</span>
            {!isValidDeck && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">Min: 20</span>
              </div>
            )}
          </div>
          <div className="text-gray-400">
            Avg Delay: {averageDelay.toFixed(1)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
        {currentDeck.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">Drag cards here to build your deck</p>
            <p className="text-sm">20-30 cards required</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Delay Distribution */}
            <div className="border-b border-gray-700 pb-3">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Delay Curve</h4>
              <div className="flex gap-3 text-xs">
                {[0, 1, 2, 3, 4].map(delay => {
                  const count = delayDistribution[delay] || 0;
                  const maxCount = Math.max(...Object.values(delayDistribution));
                  const height = maxCount > 0 ? (count / maxCount) * 40 : 0;
                  
                  return (
                    <div key={delay} className="text-center flex-1">
                      <div className="flex flex-col items-center justify-end h-12 mb-1">
                        <div 
                          className="w-full bg-blue-600 rounded-t transition-all"
                          style={{ height: `${height}px` }}
                        />
                      </div>
                      <div className="text-gray-500">{delay}</div>
                      <div className="text-white font-bold">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card List */}
            <div className="space-y-2">
              {uniqueCards.map(card => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-2 rounded bg-gray-700/50 hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-sm font-bold">
                      {card.delay}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{card.name}</div>
                      <div className="text-xs text-gray-400">{card.damageType}</div>
                    </div>
                    <div className="text-sm font-bold text-blue-400">
                      x{cardCounts[card.id]}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCardFromDeck(card.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </UICard>
  );
};