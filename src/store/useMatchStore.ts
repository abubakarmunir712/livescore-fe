import { create } from "zustand";

type StatusFilter = "live" | "upcoming" | "finished";
const backend_url = import.meta.env.VITE_API_ENDPOINT;

interface MatchStore {
  data: any[];
  total: number | null;
  isLoading: boolean;
  error: string | null;
  fetchMatches: (
    date: Date,
    status: StatusFilter,
    start: number,
    search: string,
    toggle: boolean,
    append?: boolean
  ) => Promise<void>;
  setIsLoading: (val: boolean) => void;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  data: [],
  total: null,
  isLoading: true,
  error: null,

  setIsLoading: (val) => set({ isLoading: val }),

  fetchMatches: async (
    date: Date,
    status: StatusFilter,
    start: number,
    search: string,
    toggle: boolean,
    append = false
  ) => {
    set({ error: null });

    try {
      const dateString = `${date
        .toLocaleString("sv-SE", { hour12: false })
        .replace(" ", "T")}Z`;
      const timezone = date.getTimezoneOffset();

      const body = { date: dateString, timezone, status, start, search, toggle };
      const res = await fetch(`${backend_url}/football/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        set({ error: "Failed to fetch matches" });
      } else {
        set({
          data: append ? [...(get().data || []), ...json.data] : json.data,
          total: json.total ?? null, // ✅ keep total in Zustand
          error: null,
        });
      }
    } catch (err: any) {
      set({ error: "Failed to fetch matches" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
