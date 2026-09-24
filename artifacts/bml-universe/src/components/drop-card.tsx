import React from "react";
import { Drop } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DropCardProps {
  drop: Drop;
  isSaved: boolean;
  onToggleSave: (drop: Drop) => void;
  index?: number;
}

export function DropCard({ drop, isSaved, onToggleSave, index = 0 }: DropCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative border-2 border-primary/20 hover:border-primary bg-card text-card-foreground p-6 transition-colors overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4">
        <button
          onClick={() => onToggleSave(drop)}
          className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
        >
          {isSaved ? (
            <BookmarkCheck className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          ) : (
            <Bookmark className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50 rounded-none uppercase text-xs font-bold">
              {drop.type}
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/50 rounded-none uppercase text-xs font-bold">
              {drop.category}
            </Badge>
          </div>
          <h2 className="text-3xl font-display font-bold uppercase leading-none tracking-tighter text-white group-hover:glitch-text">
            {drop.name}
          </h2>
          <p className="text-xl font-display italic text-muted-foreground">
            "{drop.tagline}"
          </p>
        </div>

        <div className="bg-secondary/50 p-4 border border-secondary border-l-4 border-l-primary">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{drop.lore}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
            T-Shirt Specs // Concept Data
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block uppercase mb-1">Fonts</span>
              <span>{drop.tshirtConcept.fonts}</span>
            </div>
            <div>
              <span className="text-muted-foreground block uppercase mb-1">Colors</span>
              <span>{drop.tshirtConcept.colors}</span>
            </div>
            <div>
              <span className="text-muted-foreground block uppercase mb-1">Symbols</span>
              <span>{drop.tshirtConcept.symbols}</span>
            </div>
            <div>
              <span className="text-muted-foreground block uppercase mb-1">Vibe</span>
              <span>{drop.tshirtConcept.vibe}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative noise/pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.05),transparent_50%)]" />
    </motion.div>
  );
}
