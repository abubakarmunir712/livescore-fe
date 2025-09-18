import { create } from "zustand";
import type { SearchTab, StatusFilter } from "../types/types";


interface FilterStore {
    search: { query: string; tab: SearchTab };
    statusFilter: StatusFilter;
    dateFilter: Date;
    groupToggle: boolean;

    // setters
    setSearchQuery: (query: string) => void;
    setSearchTab: (tab: SearchTab) => void;
    setStatusFilter: (status: StatusFilter) => void;
    setDateFilter: (date: Date) => void;
    toggleGroup: () => void;
}

// Zustand store
export const useFilterStore = create<FilterStore>((set) => ({
    search: { query: "", tab: "countries" },
    statusFilter: "live",
    dateFilter: new Date(),
    groupToggle: false,

    setSearchQuery: (query) => {
        set((state) => ({ search: { ...state.search, query } }))
    },

    setSearchTab: (tab) =>
        set((state) => ({ search: { ...state.search, tab } })),

    setStatusFilter: (status) => {
        if (status === "live") {
            set({ statusFilter: status, dateFilter: new Date() })
        }
        else {
            set({ statusFilter: status })
        }
    },

    setDateFilter: (date) => {
        let d = new Date()
        if (d.setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0)) {
            set({ dateFilter: date, statusFilter: "live" })
        }

        if (d.setHours(0, 0, 0, 0) < date.setHours(0, 0, 0, 0)) {
            set({ dateFilter: date, statusFilter: "upcoming" })
        }

        if (d.setHours(0, 0, 0, 0) > date.setHours(0, 0, 0, 0)) {
            set({ dateFilter: date, statusFilter: "finished" })
        }
    },

    toggleGroup: () => set((state) => ({ groupToggle: !state.groupToggle })),
}));