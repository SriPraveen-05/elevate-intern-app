import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { STORAGE_KEYS } from "@/lib/storage";

export default function DataSync() {
  const qc = useQueryClient();

  useEffect(() => {
    const invalidate = (key?: string | null) => {
      if (!key) return;
      if (key === STORAGE_KEYS.postings) qc.invalidateQueries({ queryKey: ["postings"] });
      if (key === STORAGE_KEYS.applications) qc.invalidateQueries({ queryKey: ["applications"] });
      if (key === STORAGE_KEYS.logbook) qc.invalidateQueries({ queryKey: ["logbook"] });
    };

    const onStorage = (e: StorageEvent) => invalidate(e.key);
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key?: string } | undefined;
      invalidate(detail?.key);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("data-change", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("data-change", onCustom as EventListener);
    };
  }, [qc]);

  return null;
}
