import { useState, useEffect, useCallback } from "react";
import { Drop } from "@workspace/api-client-react";

export function useArchive() {
  const [savedDrops, setSavedDrops] = useState<Drop[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bml-archive");
      if (stored) {
        setSavedDrops(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load archive", e);
    }
  }, []);

  const saveDrop = useCallback((drop: Drop) => {
    setSavedDrops((prev) => {
      const exists = prev.some((d) => d.id === drop.id);
      if (exists) return prev;
      const next = [drop, ...prev];
      localStorage.setItem("bml-archive", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeDrop = useCallback((id: string) => {
    setSavedDrops((prev) => {
      const next = prev.filter((d) => d.id !== id);
      localStorage.setItem("bml-archive", JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => {
    return savedDrops.some((d) => d.id === id);
  }, [savedDrops]);

  return { savedDrops, saveDrop, removeDrop, isSaved };
}
