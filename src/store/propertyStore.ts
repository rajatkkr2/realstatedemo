import { create } from "zustand";
import { mockProperties } from "@/utils/mockData";

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  country: string;
  propertyType: string;
  bhk: number;
  sqft: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt: number;
  status: string;
  amenities: string[];
  images: string[];
  videos: string[];
  agent: string;
  featured: boolean;
  views: number;
  likes: number;
  coordinates: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  search: string;
  city: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bhk: number;
  status: string;
}

interface PropertyState {
  properties: Property[];
  filteredProperties: Property[];
  selectedProperty: Property | null;
  wishlist: string[];
  filters: Filters;
  isLoading: boolean;
  fetchProperties: () => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
  applyFilters: () => void;
  selectProperty: (property: Property | null) => void;
  toggleWishlist: (id: string) => void;
  resetDemoData: () => void;
}

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const defaultFilters: Filters = {
  search: "",
  city: "",
  propertyType: "",
  minPrice: 0,
  maxPrice: 100000000,
  bhk: 0,
  status: "",
};

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  filteredProperties: [],
  selectedProperty: null,
  wishlist: [],
  filters: defaultFilters,
  isLoading: false,

  fetchProperties: async () => {
    set({ isLoading: true });
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 600));
      set({ properties: mockProperties as Property[], filteredProperties: mockProperties as Property[], isLoading: false });
      return;
    }
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      set({ properties: data, filteredProperties: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { properties, filters } = get();
    let result = [...properties];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }
    if (filters.city) result = result.filter((p) => p.city === filters.city);
    if (filters.propertyType) result = result.filter((p) => p.propertyType === filters.propertyType);
    if (filters.bhk) result = result.filter((p) => p.bhk === filters.bhk);
    if (filters.status) result = result.filter((p) => p.status === filters.status);
    result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    set({ filteredProperties: result });
  },

  selectProperty: (property) => set({ selectedProperty: property }),

  toggleWishlist: (id) => {
    set((state) => ({
      wishlist: state.wishlist.includes(id)
        ? state.wishlist.filter((w) => w !== id)
        : [...state.wishlist, id],
    }));
  },

  resetDemoData: () => {
    set({
      properties: mockProperties as Property[],
      filteredProperties: mockProperties as Property[],
      filters: defaultFilters,
      wishlist: [],
    });
  },
}));
