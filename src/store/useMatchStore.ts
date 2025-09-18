import { create } from "zustand";

type StatusFilter = "live" | "upcoming" | "finished";
const backend_url = import.meta.env.VITE_API_ENDPOINT

interface MatchStore {
    data: any | null;
    isLoading: boolean;
    error: string | null;
    fetchMatches: (date: Date, status: StatusFilter) => Promise<void>;
    setIsLoading: (val: boolean) => void
}

export const useMatchStore = create<MatchStore>((set) => ({
    data: null,
    isLoading: true,
    error: null,
    setIsLoading: (val) => set({ isLoading: val }),

    fetchMatches: async (date: Date, status: StatusFilter) => {
        set({ error: null });

        try {
            const dateString = `${date.toLocaleString("sv-SE", { hour12: false }).replace(" ", "T")}Z`;
            const timezone = date.getTimezoneOffset();

            const body = { date: dateString, timezone, status };
            console.log("Making request")
            const res = await fetch(`${backend_url}/football/matches`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                console.error("Failed to fetch matches:", data);
                set({ error: data.error ?? "Unknown error", data: null });
            } else {
                set({ data: data.data, error: null });
            }
        } catch (err: any) {
            console.error("Failed to fetch matches:", err);
            set({ error: err.message || "Unknown error", data: null });
        } finally {
            set({ isLoading: false });
        }
    },
}));
