import { useEffect } from 'react';
import { useDeckBuilderStore } from '../../../store/deckBuilderStore';

export function useKeyboardShortcuts() {
  const { clearFilters, saveDeck, clearDeck } = useDeckBuilderStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Cmd/Ctrl + S to save deck
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveDeck();
      }

      // Cmd/Ctrl + K to clear filters
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        clearFilters();
      }

      // Cmd/Ctrl + Shift + D to clear deck
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
        e.preventDefault();
        if (confirm('Are you sure you want to clear the current deck?')) {
          clearDeck();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [clearFilters, saveDeck, clearDeck]);
}