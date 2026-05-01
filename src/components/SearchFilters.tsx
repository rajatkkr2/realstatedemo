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
    "w-full rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30 appearance-none cursor-pointer";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search properties, locations, cities..."
            className="w-full rounded-xl bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-[var(--neon-cyan)]/30 transition-all"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(""); setFilters({ search: "" }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all"
          style={{
            background: showFilters ? "rgba(0,240,255,0.15)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${showFilters ? "rgba(0,240,255,0.3)" : "rgba(255,255,255,0.1)"}`,
            color: showFilters ? "var(--neon-cyan)" : "white",
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
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">CITY</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ city: e.target.value })}
              className={selectClass}
            >
              <option value="" className="bg-[#0a0a2e]">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c} className="bg-[#0a0a2e]">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">TYPE</label>
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ propertyType: e.target.value })}
              className={selectClass}
            >
              <option value="" className="bg-[#0a0a2e]">All Types</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t} className="bg-[#0a0a2e]">{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">BHK</label>
            <select
              value={filters.bhk}
              onChange={(e) => setFilters({ bhk: Number(e.target.value) })}
              className={selectClass}
            >
              <option value={0} className="bg-[#0a0a2e]">Any</option>
              {[1, 2, 3, 4, 5, 7].map((b) => (
                <option key={b} value={b} className="bg-[#0a0a2e]">{b} BHK</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">STATUS</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className={selectClass}
            >
              <option value="" className="bg-[#0a0a2e]">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s} className="bg-[#0a0a2e]">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">MAX PRICE</label>
            <select
              value={filters.maxPrice}
              onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
              className={selectClass}
            >
              <option value={100000000} className="bg-[#0a0a2e]">Any</option>
              <option value={10000000} className="bg-[#0a0a2e]">₹1 Cr</option>
              <option value={20000000} className="bg-[#0a0a2e]">₹2 Cr</option>
              <option value={30000000} className="bg-[#0a0a2e]">₹3 Cr</option>
              <option value={50000000} className="bg-[#0a0a2e]">₹5 Cr</option>
              <option value={75000000} className="bg-[#0a0a2e]">₹7.5 Cr</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
}
