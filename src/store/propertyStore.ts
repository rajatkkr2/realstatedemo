import { create } from "zustand";

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
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
  agentName: string;
  featured: boolean;
  views: number;
  likes: number;
  coordinates: { lat: number; lng: number };
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  search: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
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
}

const defaultFilters: Filters = {
  search: "",
  city: "",
  state: "",
  pincode: "",
  area: "",
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
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      set({ properties: list, filteredProperties: list, isLoading: false });
    } catch {
      set({ properties: [], filteredProperties: [], isLoading: false });
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
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          (p.pincode && p.pincode.includes(q)) ||
          (p.area && p.area.toLowerCase().includes(q))
      );
    }
    if (filters.city) result = result.filter((p) => p.city.toLowerCase() === filters.city.toLowerCase());
    if (filters.state) result = result.filter((p) => p.state.toLowerCase() === filters.state.toLowerCase());
    if (filters.pincode) result = result.filter((p) => p.pincode === filters.pincode);
    if (filters.area) result = result.filter((p) => p.area?.toLowerCase() === filters.area.toLowerCase());
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
}));
