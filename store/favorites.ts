import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesState {
  favoriteClubIds: string[];
  addFavorite: (clubId: string) => void;
  removeFavorite: (clubId: string) => void;
  toggleFavorite: (clubId: string) => void;
  isFavorite: (clubId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteClubIds: [],
      
      addFavorite: (clubId: string) => 
        set((state) => ({
          favoriteClubIds: [...state.favoriteClubIds, clubId]
        })),
      
      removeFavorite: (clubId: string) => 
        set((state) => ({
          favoriteClubIds: state.favoriteClubIds.filter(id => id !== clubId)
        })),
      
      toggleFavorite: (clubId: string) => {
        const { favoriteClubIds, addFavorite, removeFavorite } = get();
        if (favoriteClubIds.includes(clubId)) {
          removeFavorite(clubId);
        } else {
          addFavorite(clubId);
        }
      },
      
      isFavorite: (clubId: string) => {
        return get().favoriteClubIds.includes(clubId);
      }
    }),
    {
      name: "club-favorites",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);