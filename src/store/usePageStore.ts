import { create } from "zustand";
import type { PageType } from "../types/types";

interface PageStore {
    pageType: PageType;
    setPageType: (pageType: PageType) => void;
}

export const usePageStore = create<PageStore>((set) => ({
    pageType: "home",
    setPageType: (pageType) => set({ pageType }),
}));
