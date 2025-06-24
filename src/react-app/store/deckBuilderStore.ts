import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Card } from '../../game/models/Unit';
import { toast } from 'sonner';

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  faction: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeckBuilderState {
  // Current deck being built
  currentDeck: Card[];
  deckName: string;
  
  // Saved decks
  savedDecks: Deck[];
  
  // Filter state
  searchQuery: string;
  selectedRarities: string[];
  selectedDelays: number[];
  selectedTypes: string[];
  
  // Actions
  addCardToDeck: (card: Card) => void;
  removeCardFromDeck: (cardId: string) => void;
  clearDeck: () => void;
  setDeckName: (name: string) => void;
  
  saveDeck: () => void;
  loadDeck: (deckId: string) => void;
  deleteDeck: (deckId: string) => void;
  
  setSearchQuery: (query: string) => void;
  toggleRarity: (rarity: string) => void;
  toggleDelay: (delay: number) => void;
  toggleType: (type: string) => void;
  clearFilters: () => void;
}

export const useDeckBuilderStore = create<DeckBuilderState>()(
  persist(
    (set, get) => ({
      currentDeck: [],
      deckName: 'New Deck',
      savedDecks: [],
      
      searchQuery: '',
      selectedRarities: [],
      selectedDelays: [],
      selectedTypes: [],
      
      addCardToDeck: (card) => {
        const { currentDeck } = get();
        // Check deck size limit (max 30 cards)
        if (currentDeck.length >= 30) {
          toast.error('Deck is full! Maximum 30 cards allowed.');
          return;
        }
        
        // Check for card limit (max 3 copies of same card)
        const sameCardCount = currentDeck.filter(c => c.id === card.id).length;
        if (sameCardCount >= 3) {
          toast.error(`Maximum 3 copies of "${card.name}" allowed.`);
          return;
        }
        
        set({ currentDeck: [...currentDeck, card] });
        toast.success(`Added "${card.name}" to deck`);
      },
      
      removeCardFromDeck: (cardId) => {
        const { currentDeck } = get();
        const index = currentDeck.findIndex(c => c.id === cardId);
        if (index === -1) return;
        
        const newDeck = [...currentDeck];
        newDeck.splice(index, 1);
        set({ currentDeck: newDeck });
      },
      
      clearDeck: () => set({ currentDeck: [], deckName: 'New Deck' }),
      
      setDeckName: (name) => set({ deckName: name }),
      
      saveDeck: () => {
        const { currentDeck, deckName, savedDecks } = get();
        if (currentDeck.length < 20) {
          toast.error('Deck must have at least 20 cards!');
          return;
        }
        
        const newDeck: Deck = {
          id: `deck-${Date.now()}`,
          name: deckName,
          cards: [...currentDeck],
          faction: 'Ashen Legion',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set({ savedDecks: [...savedDecks, newDeck] });
        toast.success(`Deck "${deckName}" saved successfully!`);
      },
      
      loadDeck: (deckId) => {
        const { savedDecks } = get();
        const deck = savedDecks.find(d => d.id === deckId);
        if (!deck) return;
        
        set({
          currentDeck: [...deck.cards],
          deckName: deck.name,
        });
      },
      
      deleteDeck: (deckId) => {
        const { savedDecks } = get();
        set({ savedDecks: savedDecks.filter(d => d.id !== deckId) });
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      toggleRarity: (rarity) => {
        const { selectedRarities } = get();
        const isSelected = selectedRarities.includes(rarity);
        set({
          selectedRarities: isSelected
            ? selectedRarities.filter(r => r !== rarity)
            : [...selectedRarities, rarity],
        });
      },
      
      toggleDelay: (delay) => {
        const { selectedDelays } = get();
        const isSelected = selectedDelays.includes(delay);
        set({
          selectedDelays: isSelected
            ? selectedDelays.filter(d => d !== delay)
            : [...selectedDelays, delay],
        });
      },
      
      toggleType: (type) => {
        const { selectedTypes } = get();
        const isSelected = selectedTypes.includes(type);
        set({
          selectedTypes: isSelected
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type],
        });
      },
      
      clearFilters: () => set({
        searchQuery: '',
        selectedRarities: [],
        selectedDelays: [],
        selectedTypes: [],
      }),
    }),
    {
      name: 'deck-builder-storage',
    }
  )
);