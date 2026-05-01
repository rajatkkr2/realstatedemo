"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePropertyStore } from "@/store/propertyStore";
import { propertyTypes, cities, statusOptions } from "@/utils/mockData";

export default function SearchFilters() {
  const { filters, setFilters } = usePropertyStore();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  const debouncedSearch = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        setFilters({ search: value });
      }, 400);
      return () => clearTimeout(timer);
    },
    [setFilters]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchInput);
    return cleanup;
  }, [searchInput, debouncedSearch]);

  const selectClass =
    "w-full rounded-xl px-3 py-2.5 text-sm outline-none appearance-none cursor-pointer transition-all";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--navy-muted)" }} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search properties, locations, cities..."
            className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
            style={{ background: "white", color: "var(--navy)", border: "1px solid var(--card-border)" }}
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(""); setFilters({ search: "" }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
              style={{ color: "var(--navy-muted)" }}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all"
          style={{
            background: showFilters ? "var(--royal-gold)" : "white",
            border: `1px solid ${showFilters ? "var(--royal-gold)" : "var(--card-border)"}`,
            color: showFilters ? "white" : "var(--navy)",
          }}
        >
          <SlidersHorizontal size={16} />
          Filters
        </motion.button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="grid grid-cols-2 gap-3 rounded-2xl p-4 md:grid-cols-5"
          style={{ background: "white", border: "1px solid var(--card-border)", boxShadow: "var(--card-shadow)" }}
        >
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>CITY</label>
            <select value={filters.city} onChange={(e) => setFilters({ city: e.target.value })}
              className={selectClass} style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }}>
              <option value="">All Cities</option>
              {cities.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>TYPE</label>
            <select value={filters.propertyType} onChange={(e) => setFilters({ propertyType: e.target.value })}
              className={selectClass} style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }}>
              <option value="">All Types</option>
              {propertyTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>BHK</label>
            <select value={filters.bhk} onChange={(e) => setFilters({ bhk: Number(e.target.value) })}
              className={selectClass} style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }}>
              <option value={0}>Any</option>
              {[1, 2, 3, 4, 5, 7].map((b) => (<option key={b} value={b}>{b} BHK</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>STATUS</label>
            <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}
              className={selectClass} style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }}>
              <option value="">All</option>
              {statusOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider" style={{ color: "var(--navy-muted)" }}>MAX PRICE</label>
            <select value={filters.maxPrice} onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
              className={selectClass} style={{ background: "var(--cream)", color: "var(--navy)", border: "1px solid var(--card-border)" }}>
              <option value={100000000}>Any</option>
              <option value={10000000}>₹1 Cr</option>
              <option value={20000000}>₹2 Cr</option>
              <option value={30000000}>₹3 Cr</option>
              <option value={50000000}>₹5 Cr</option>
              <option value={75000000}>₹7.5 Cr</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
}
