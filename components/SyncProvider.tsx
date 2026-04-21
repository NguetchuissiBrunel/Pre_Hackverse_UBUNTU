"use client";

import { useSync } from "@/hooks/useSync";

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  useSync(); // Initialise la synchronisation globale
  return <>{children}</>;
}
