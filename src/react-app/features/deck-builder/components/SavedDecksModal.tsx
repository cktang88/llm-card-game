import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Trash2, Clock, Layers } from 'lucide-react';
import { useDeckBuilderStore } from '../../../store/deckBuilderStore';
import { formatDistanceToNow } from 'date-fns';

interface SavedDecksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(date: Date): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'Recently';
  }
}

export const SavedDecksModal: React.FC<SavedDecksModalProps> = ({ isOpen, onClose }) => {
  const { savedDecks, loadDeck, deleteDeck } = useDeckBuilderStore();

  const handleLoadDeck = (deckId: string) => {
    loadDeck(deckId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Saved Decks</DialogTitle>
          <DialogDescription className="text-gray-400">
            Load a previously saved deck or manage your deck collection
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
          {savedDecks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No saved decks yet</p>
              <p className="text-sm mt-1">Build and save your first deck!</p>
            </div>
          ) : (
            savedDecks.map(deck => {
              const avgDelay = deck.cards.reduce((sum, card) => sum + card.delay, 0) / deck.cards.length;
              
              return (
                <Card
                  key={deck.id}
                  className="bg-gray-800 border-gray-700 p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{deck.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <span>{deck.cards.length} cards</span>
                        <span>Avg delay: {avgDelay.toFixed(1)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(deck.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleLoadDeck(deck.id)}
                        size="sm"
                      >
                        Load
                      </Button>
                      <Button
                        onClick={() => deleteDeck(deck.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};