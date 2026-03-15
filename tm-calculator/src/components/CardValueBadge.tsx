"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CardValueBadgeProps {
  rating: string;
  netValue: number;
}

const ratingColors: Record<string, string> = {
  S: "bg-yellow-500 text-black",
  A: "bg-green-500 text-white",
  B: "bg-blue-500 text-white",
  C: "bg-gray-500 text-white",
  D: "bg-orange-500 text-white",
  F: "bg-red-500 text-white",
};

export function CardValueBadge({ rating, netValue }: CardValueBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={cn("text-sm font-bold px-3 py-1", ratingColors[rating] || "bg-gray-500")}>
        {rating}
      </Badge>
      <span className={cn("text-sm font-mono", netValue >= 0 ? "text-green-400" : "text-red-400")}>
        {netValue >= 0 ? "+" : ""}{netValue} MC
      </span>
    </div>
  );
}
