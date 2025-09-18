import { create } from "zustand";

interface StoreState {
  countries: string[];
  leagues: string[];
  teams: string[];
  setCountries: (countries: string[]) => void;
  setLeagues: (leagues: string[]) => void;
  setTeams: (teams: string[]) => void;
}

export const useSearchStore = create<StoreState>((set) => ({
  countries: [],
  leagues: [],
  teams: [],
  setCountries: (countries) => set({ countries }),
  setLeagues: (leagues) => set({ leagues }),
  setTeams: (teams) => set({ teams }),
}));
