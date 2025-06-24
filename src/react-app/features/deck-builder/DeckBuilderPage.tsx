import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameNavigation } from '../../components/GameNavigation';
import { CardFilters } from './components/CardFilters';
import { CardGrid } from './components/CardGrid';
import { DeckList } from './components/DeckList';
import { SavedDecksModal } from './components/SavedDecksModal';
import { DeckStats } from './components/DeckStats';
import { useDeckBuilderStore } from '../../store/deckBuilderStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export const DeckBuilderPage: React.FC = () => {
  const [showSavedDecks, setShowSavedDecks] = useState(false);
  const currentDeck = useDeckBuilderStore(state => state.currentDeck);
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <GameNavigation />
        
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Deck Builder</h1>
            <p className="text-gray-400 mt-1">Build your Ashen Legion deck</p>
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              <span>⌘/Ctrl + S: Save deck</span>
              <span>⌘/Ctrl + K: Clear filters</span>
              <span>⌘/Ctrl + Shift + D: Clear deck</span>
            </div>
          </div>

          {/* Main Content - Responsive Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_320px] gap-6">
            {/* Left Sidebar - Filters & Stats */}
            <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-120px)] space-y-4">
              <CardFilters />
              <div className="hidden xl:block">
                <DeckStats cards={currentDeck} />
              </div>
            </div>

            {/* Center - Card Grid */}
            <div className="order-3 xl:order-2 overflow-y-auto xl:max-h-[calc(100vh-120px)] xl:pr-2">
              <CardGrid />
            </div>

            {/* Right Sidebar - Deck List */}
            <div className="order-2 xl:order-3 xl:sticky xl:top-6 xl:h-[calc(100vh-120px)]">
              <DeckList onLoadDeck={() => setShowSavedDecks(true)} />
            </div>

            {/* Mobile Stats - Show below filters on mobile */}
            <div className="order-4 xl:hidden">
              <DeckStats cards={currentDeck} />
            </div>
          </div>
        </div>

        {/* Saved Decks Modal */}
        <SavedDecksModal
          isOpen={showSavedDecks}
          onClose={() => setShowSavedDecks(false)}
        />
      </div>
    </DndProvider>
  );
};