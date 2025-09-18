import React, { useEffect, useRef, useState } from "react";
import { Search} from "lucide-react";
import { useSearchStore } from "../store/useSearchStore";
import type { SearchTab } from "../types/types";
import { useFilterStore } from "../store/useFilterStore";
import { usePageStore } from "../store/usePageStore";

const Header: React.FC = () => {
  const { teams, countries, leagues } = useSearchStore();
  const { setSearchQuery, setSearchTab } = useFilterStore()
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("countries");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterItems = (items: string[]) => {
    const words = query.toLowerCase().trim().split(/\s+/);
    return items.filter((item) =>
      words.every((word) => item.toLowerCase().includes(word))
    );
  };

  const results = {
    countries: filterItems(countries || []),
    leagues: filterItems(leagues || []),
    teams: filterItems(teams || []),
  };

  const items = results[activeTab];


  useEffect(() => {
    itemRefs.current = new Array(items.length).fill(null);
    if (items.length === 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((prev) => {
      if (prev < 0) return 0;
      if (prev >= items.length) return items.length - 1;
      return prev;
    });
  }, [items.length]);


  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    const parent = listRef.current;
    if (!el || !parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const elTopRelativeToParent = elRect.top - parentRect.top + parent.scrollTop;
    const elBottomRelativeToParent = elTopRelativeToParent + el.offsetHeight;

    if (elTopRelativeToParent < parent.scrollTop) {
      parent.scrollTo({ top: elTopRelativeToParent, behavior: "auto" });
    } else if (elBottomRelativeToParent > parent.scrollTop + parent.clientHeight) {
      parent.scrollTo({ top: elBottomRelativeToParent - parent.clientHeight, behavior: "auto" });
    }
  }, [activeIndex]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value == "") {
      setSearchQuery("")
    }
    setActiveIndex(0);
    setIsFocused(true);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearch()
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }

  }
  const { setPageType } = usePageStore()


  const handleSearch = () => {
    const selected = items[activeIndex];
    if (selected) {
      setQuery(selected);
      setSearchQuery(selected)
      setIsFocused(false);
      setPageType("home")
      inputRef.current?.blur();
    }
    else {
      setQuery("");
      setSearchQuery("")
      setIsFocused(false);
      inputRef.current?.blur();
    }
  }

  return (
    <header className="bg-surface px-3 sm:px-4 md:px-10 py-2 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center gap-2 text-text font-bold text-lg sm:text-xl">
        <img src="/logo.png" alt="" className="h-16"/>
        <span className="sm:block hidden">MyTableScore</span>
      </div>

      {/* Search Box */}
      <div className="relative w-40 sm:w-52 md:w-60" ref={wrapperRef}>
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="
              bg-background 
              text-text 
              placeholder-text-muted 
              px-3 sm:py-2 py-1 
              focus:outline-none
              w-full
            "
          />
          <button
            className="
              px-3 sm:py-2 py-1
              text-text 
              hover:text-accent 
              focus:outline-none
            "
            type="button"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Dropdown */}
        {isFocused && (
          <div className="absolute top-full right-0 mt-1 min-w-full w-fit bg-background border border-border rounded-md shadow-lg z-50">
            {/* Tabs */}
            <div className="flex border-b mb-2 border-border">
              {(["countries", "leagues", "teams"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // keep input focused
                  onClick={() => {
                    setActiveTab(tab);
                    setActiveIndex(0);
                    setSearchTab(tab)
                    inputRef.current?.focus();
                  }}
                  className={`flex-1 px-3 py-2 text-sm capitalize ${activeTab === tab ? "text-accent border-b-2 border-accent" : "text-text-muted"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Results */}
            <ul ref={listRef} className="max-h-60 overflow-y-auto custom-scrollbar">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <li
                    key={item}
                    ref={(el: HTMLLIElement | null) => {
                      itemRefs.current[idx] = el;
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      setQuery(item);
                      setSearchQuery(item)
                      setIsFocused(false);
                      inputRef.current?.blur();
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer ${idx === activeIndex ? "bg-accent text-white" : "text-text hover:bg-surface"}`}
                  >
                    {item}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-text-muted">No results</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
