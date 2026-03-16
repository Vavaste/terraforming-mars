"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tagColors: Record<string, string> = {
  building: "bg-amber-700",
  space: "bg-gray-800 border-gray-600",
  power: "bg-purple-700",
  science: "bg-pink-600",
  plant: "bg-green-700",
  microbe: "bg-lime-600",
  animal: "bg-emerald-600",
  city: "bg-blue-800",
  earth: "bg-cyan-600",
  jovian: "bg-orange-600",
  venus: "bg-sky-400 text-black",
  wild: "bg-white text-black",
};

export function TagBadge({ tag }: { tag: string }) {
  return (
    <Badge className={cn("text-xs", tagColors[tag] || "bg-gray-600")}>
      {tag}
    </Badge>
  );
}
