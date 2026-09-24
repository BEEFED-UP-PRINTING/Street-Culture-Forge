import React from "react";
import { Link, useLocation } from "wouter";
import { Cpu, Library } from "lucide-react";
import { useGetDropStats, getGetDropStatsQueryKey } from "@workspace/api-client-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: stats } = useGetDropStats({ query: { queryKey: getGetDropStatsQueryKey() } });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark selection:bg-primary selection:text-primary-foreground">
      <div className="crt-overlay" />
      
      <header className="border-b border-primary/20 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl leading-none">
              B
            </div>
            <span className="font-display font-bold uppercase tracking-widest text-lg group-hover:glitch-text">
              BML Universe
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm uppercase tracking-widest flex items-center gap-2 transition-colors ${location === '/' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}
            >
              <Cpu className="w-4 h-4" />
              Generator
            </Link>
            <Link 
              href="/archive" 
              className={`text-sm uppercase tracking-widest flex items-center gap-2 transition-colors ${location === '/archive' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}
            >
              <Library className="w-4 h-4" />
              Archive
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-primary/20 bg-secondary/30 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground uppercase tracking-widest">
          <div>
            System Online // Connected to Mainframe
          </div>
          {stats && (
            <div className="flex gap-4">
              <span>Total Drops: <span className="text-primary font-bold">{stats.totalGenerated}</span></span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
