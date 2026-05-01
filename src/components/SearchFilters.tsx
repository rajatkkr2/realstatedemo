"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import { usePropertyStore } from "@/store/propertyStore";

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Studio", "Plot", "Commercial", "Independent House", "Builder Floor"];
const statusOptions = ["Available", "Sold", "Draft"];

export default function SearchFilters() {
  const { properties, filters, setFilters } = usePropertyStore();
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

  const cities = useMemo(() => [...new Set(properties.map((p) => p.city).filter(Boolean))].sort(), [properties]);
  const states = useMemo(() => [...new Set(properties.map((p) => p.state).filter(Boolean))].sort(), [properties]);
  const pincodes = useMemo(() => [...new Set(properties.map((p) => p.pincode).filter(Boolean))].sort(), [properties]);
  const areas = useMemo(() => [...new Set(properties.map((p) => p.area).filter(Boolean))].sort(), [properties]);

  const activeFilterCount = [filters.city, filters.state, filters.pincode, filters.area, filters.propertyType, filters.status].filter(Boolean).length
    + (filters.bhk ? 1 : 0)
    + (filters.maxPrice < 100000000 ? 1 : 0);

  const clearAll = () => {
    setSearchInput("");
    setFilters({ search: "", city: "", state: "", pincode: "", area: "", propertyType: "", bhk: 0, status: "", minPrice: 0, maxPrice: 100000000 });
  };

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
            placeholder="Search by name, city, state, pincode, area..."
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
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--neon-cyan)] text-[10px] font-bold text-black">
              {activeFilterCount}
            </span>
          )}
        </motion.button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="rounded-2xl p-4"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-medium text-white/50"><MapPin size={12} /> Location & Filters</p>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-[10px] text-[var(--neon-pink)] hover:underline">Clear All</button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">STATE</label>
              <select value={filters.state} onChange={(e) => setFilters({ state: e.target.value })} className={selectClass}>
                <option value="" className="bg-[#0a0a2e]">All States</option>
                {states.map((s) => <option key={s} value={s} className="bg-[#0a0a2e]">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">CITY</label>
              <select value={filters.city} onChange={(e) => setFilters({ city: e.target.value })} className={selectClass}>
                <option value="" className="bg-[#0a0a2e]">All Cities</option>
                {cities.map((c) => <option key={c} value={c} className="bg-[#0a0a2e]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">AREA / LOCALITY</label>
              <select value={filters.area} onChange={(e) => setFilters({ area: e.target.value })} className={selectClass}>
                <option value="" className="bg-[#0a0a2e]">All Areas</option>
                {areas.map((a) => <option key={a} value={a} className="bg-[#0a0a2e]">{a}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">PINCODE</label>
              <select value={filters.pincode} onChange={(e) => setFilters({ pincode: e.target.value })} className={selectClass}>
                <option value="" className="bg-[#0a0a2e]">All</option>
                {pincodes.map((p) => <option key={p} value={p} className="bg-[#0a0a2e]">{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">TYPE</label>
              <select value={filters.propertyType} onChange={(e) => setFilters({ propertyType: e.target.value })} className={selectClass}>
                <option value="" className="bg-[#0a0a2e]">All Types</option>
                {propertyTypes.map((t) => <option key={t} value={t} className="bg-[#0a0a2e]">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">BHK</label>
              <select value={filters.bhk} onChange={(e) => setFilters({ bhk: Number(e.target.value) })} className={selectClass}>
                <option value={0} className="bg-[#0a0a2e]">Any</option>
                {[1, 2, 3, 4, 5, 6, 7].map((b) => <option key={b} value={b} className="bg-[#0a0a2e]">{b} BHK</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">STATUS</label>
              <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })} className={selectClass}>
                <option value="" className="bg-[#0a0a2e]">All</option>
                {statusOptions.map((s) => <option key={s} value={s} className="bg-[#0a0a2e]">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium tracking-wider text-white/40">MAX PRICE</label>
              <select value={filters.maxPrice} onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })} className={selectClass}>
                <option value={100000000} className="bg-[#0a0a2e]">Any</option>
                <option value={5000000} className="bg-[#0a0a2e]">₹50 L</option>
                <option value={10000000} className="bg-[#0a0a2e]">₹1 Cr</option>
                <option value={20000000} className="bg-[#0a0a2e]">₹2 Cr</option>
                <option value={30000000} className="bg-[#0a0a2e]">₹3 Cr</option>
                <option value={50000000} className="bg-[#0a0a2e]">₹5 Cr</option>
                <option value={75000000} className="bg-[#0a0a2e]">₹7.5 Cr</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
