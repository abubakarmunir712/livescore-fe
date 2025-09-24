import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import { useFilterStore } from "../store/useFilterStore";
import { usePageStore } from "../store/usePageStore";

const Header: React.FC = () => {
  const { setSearchQuery } = useFilterStore();
  const { setPageType } = usePageStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setSearchQuery(""); // reset on clear
    }
  };

  const handleSearch = () => {
    if (query.trim() === "") {
      setSearchQuery("");
      return;
    }
    setSearchQuery(query.trim());
    setPageType("home");
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <header className="bg-surface px-3 sm:px-4 md:px-10 py-2 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center gap-2 text-text font-bold text-lg sm:text-xl">
        <img src="/logo.png" alt="logo" className="h-16" />
        <span className="sm:block hidden">MyTableScore</span>
      </div>

      {/* Search Box */}
      <div className="relative w-40 sm:w-52 md:w-60">
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
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
            type="button"
            onClick={handleSearch}
            className="px-3 sm:py-2 py-1 text-text hover:text-accent focus:outline-none"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
