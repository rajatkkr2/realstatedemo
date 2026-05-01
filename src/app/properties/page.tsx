"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePropertyStore } from "@/store/propertyStore";
import { isDemo } from "@/utils/isDemo";

export default function PropertiesPage() {
  const { filteredProperties, fetchProperties, isLoading, properties } = usePropertyStore();

  useEffect(() => {
    if (properties.length === 0) fetchProperties();
  }, [properties.length, fetchProperties]);

  return (
    <div className="min-h-screen px-4 pt-24 pb-12" style={{ marginTop: isDemo ? "36px" : "0" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Building2 size={24} className="text-[var(--neon-cyan)]" />
            <h1 className="text-3xl font-bold text-white">Properties</h1>
          </div>
          <p className="text-sm text-white/40">
            Discover {filteredProperties.length} futuristic living spaces across India
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SearchFilters />
        </motion.div>

        {isLoading ? (
          <LoadingSpinner text="Scanning property matrix..." />
        ) : filteredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Building2 size={48} className="mb-4 text-white/10" />
            <h3 className="text-lg font-semibold text-white/40">No Properties Found</h3>
            <p className="mt-1 text-sm text-white/20">Try adjusting your filters or search terms</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProperties.map((property, i) => (
              <PropertyCard key={property._id} property={property} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
