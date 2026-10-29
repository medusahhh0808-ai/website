import { useState, useEffect } from 'react';

const STORAGE_KEY = 'medusa_arch_vault_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  const isFavorite = (id) => favorites.includes(id);

  const toggleFavorite = (id) => {
    let nextStarred = false;
    setFavorites((prev) => {
      if (prev.includes(id)) {
        nextStarred = false;
        return prev.filter((item) => item !== id);
      } else {
        nextStarred = true;
        return [...prev, id];
      }
    });
    return nextStarred;
  };

  return { favorites, isFavorite, toggleFavorite, favoritesCount: favorites.length };
}
