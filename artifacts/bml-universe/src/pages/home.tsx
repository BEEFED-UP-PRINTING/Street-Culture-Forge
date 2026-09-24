import React, { useState } from "react";
import { useGenerateDrops, GenerateDropsBodyFilter, useGetDropStats, getGetDropStatsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { DropCard } from "@/components/drop-card";
import { useArchive } from "@/hooks/use-archive";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [filter, setFilter] = useState<GenerateDropsBodyFilter | "Any">("Any");
  const [useSeed, setUseSeed] = useState(false);
  const [seed, setSeed] = useState("");
  
  const { savedDrops, saveDrop, removeDrop, isSaved } = useArchive();
  const queryClient = useQueryClient();
  
  const generateDrops = useGenerateDrops({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDropStatsQueryKey() });
      }
    }
  });

  const handleGenerate = (count: number) => {
    generateDrops.mutate({
      data: {
        filter: filter === "Any" ? undefined : filter,
        count,
        seed: useSeed && seed ? seed : undefined,
      }
    });
  };

  const handleToggleSave = (drop: any) => {
    if (isSaved(drop.id)) {
      removeDrop(drop.id);
    } else {
      saveDrop(drop);
    }
  };

  const filters: (GenerateDropsBodyFilter | "Any")[] = [
    "Any", "Horror", "Comedy", "Rave", "Street", "Retro", "Weird", "Mixed"
  ];

  return (
    <Layout>
      <div className="space-y-12">
        <section className="space-y-8 bg-card border-2 border-primary/30 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Zap className="w-64 h-64 text-primary" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter glitch-text text-white">
                Drop Generator
              </h1>
              <p className="text-muted-foreground uppercase tracking-widest text-sm max-w-2xl">
                Initialize the cultural artifact engine. Generate fictional drops, legends, and streetwear concepts from an alternate reality.
              </p>
            </div>

            <div className="space-y-4">
              <Label className="uppercase tracking-widest text-primary font-bold text-xs">Genre Matrix</Label>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 uppercase text-xs font-bold tracking-widest transition-all border-2 ${
                      filter === f 
                        ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 border border-secondary bg-secondary/20">
              <div className="flex items-center gap-3">
                <Switch 
                  id="seed-mode" 
                  checked={useSeed} 
                  onCheckedChange={setUseSeed}
                  className="data-[state=checked]:bg-accent"
                />
                <Label htmlFor="seed-mode" className="uppercase tracking-widest text-xs font-bold flex items-center gap-2 cursor-pointer">
                  Custom Seed Mode {useSeed && <Sparkles className="w-3 h-3 text-accent" />}
                </Label>
              </div>
              
              <AnimatePresence>
                {useSeed && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 w-full overflow-hidden"
                  >
                    <Input 
                      placeholder="ENTER SEED PHRASE..." 
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      className="bg-background border-accent focus-visible:ring-accent font-mono uppercase text-sm rounded-none w-full max-w-xs"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => handleGenerate(1)} 
                disabled={generateDrops.isPending}
                className="rounded-none uppercase tracking-widest font-bold font-display text-lg h-14 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-all"
              >
                {generateDrops.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
                Generate 1 Drop
              </Button>
              <Button 
                onClick={() => handleGenerate(5)} 
                disabled={generateDrops.isPending}
                variant="outline"
                className="rounded-none uppercase tracking-widest font-bold font-display text-lg h-14 border-primary text-primary hover:bg-primary/10 hover:text-primary"
              >
                {generateDrops.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Generate 5 Drops
              </Button>
            </div>
          </div>
        </section>

        {generateDrops.isPending && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="uppercase tracking-widest text-primary font-bold animate-pulse">Synthesizing Artifacts...</p>
          </div>
        )}

        {generateDrops.data && generateDrops.data.length > 0 && !generateDrops.isPending && (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold uppercase tracking-tighter border-b-2 border-primary/30 pb-2 inline-block">
              Generated Results
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {generateDrops.data.map((drop, i) => (
                <DropCard 
                  key={drop.id} 
                  drop={drop} 
                  isSaved={isSaved(drop.id)}
                  onToggleSave={handleToggleSave}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
