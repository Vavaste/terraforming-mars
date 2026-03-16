"use client";

import { cn } from "@/lib/utils";

const typeConfig: Record<string, { color: string; label: string; bg: string }> = {
  event: { color: "text-red-400", label: "Evento", bg: "bg-red-900/30 border-red-800" },
  automated: { color: "text-green-400", label: "Automatica", bg: "bg-green-900/30 border-green-800" },
  active: { color: "text-blue-400", label: "Attiva", bg: "bg-blue-900/30 border-blue-800" },
  prelude: { color: "text-pink-400", label: "Preludio", bg: "bg-pink-900/30 border-pink-800" },
};

export function CardTypeIcon({ type }: { type: string }) {
  const config = typeConfig[type] || { color: "text-gray-400", label: type, bg: "bg-gray-900/30" };
  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded border", config.bg, config.color)}>
      {config.label}
    </span>
  );
}
