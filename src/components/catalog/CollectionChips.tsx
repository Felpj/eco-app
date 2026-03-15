import { motion } from "framer-motion";
import { collections } from "@/data/products";
import { cn } from "@/lib/utils";

interface CollectionChipsProps {
  activeCollection: string | null;
  onCollectionChange: (collectionId: string | null) => void;
}

const CollectionChips = ({ activeCollection, onCollectionChange }: CollectionChipsProps) => {
  return (
    <div className="py-4 border-b border-[var(--glass-border)] bg-background/90 backdrop-blur-md sticky top-16 md:top-20 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

          {/* Chip "Todos" */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onCollectionChange(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap",
              "transition-all duration-250 ease-expo-out flex-shrink-0",
              activeCollection === null
                ? "bg-gradient-gold text-[#080808] shadow-gold-sm"
                : "glass text-muted-foreground hover:text-gold hover:border-gold/25",
            )}
          >
            Todos
          </motion.button>

          {collections.map((collection, i) => {
            const isActive = activeCollection === collection.id;
            return (
              <motion.button
                key={collection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * (i + 1), duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onCollectionChange(isActive ? null : collection.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap",
                  "transition-all duration-250 ease-expo-out flex-shrink-0",
                  isActive
                    ? "bg-gradient-gold text-[#080808] shadow-gold-sm"
                    : "glass text-muted-foreground hover:text-gold hover:border-gold/25",
                )}
              >
                {collection.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CollectionChips;
