import React from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { DropCard } from "@/components/drop-card";
import { useArchive } from "@/hooks/use-archive";
import { Button } from "@/components/ui/button";
import { Library, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Archive() {
  const { savedDrops, removeDrop, isSaved } = useArchive();

  return (
    <Layout>
      <div className="space-y-12">
        <div className="space-y-4 border-b-2 border-primary/30 pb-8">
          <div className="flex items-center gap-4">
            <Library className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white">
              The Archive
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground uppercase tracking-widest text-sm">
              Digital museum of curated chaos.
            </p>
            <div className="bg-primary/10 border border-primary text-primary px-4 py-1 font-bold uppercase text-sm tracking-widest">
              {savedDrops.length} Artifacts Stored
            </div>
          </div>
        </div>

        {savedDrops.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6 border-2 border-dashed border-muted p-12"
          >
            <div className="w-24 h-24 bg-muted/20 flex items-center justify-center rounded-full text-muted-foreground mb-4">
              <Zap className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white">Archive Empty</h2>
              <p className="text-muted-foreground uppercase tracking-widest text-sm max-w-md">
                No artifacts have been preserved in the mainframe. Return to the generator to synthesize new drops.
              </p>
            </div>
            <Link href="/">
              <Button className="rounded-none uppercase tracking-widest font-bold mt-4 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary">
                Boot Generator
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savedDrops.map((drop, i) => (
              <DropCard 
                key={drop.id} 
                drop={drop} 
                isSaved={true}
                onToggleSave={() => removeDrop(drop.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
