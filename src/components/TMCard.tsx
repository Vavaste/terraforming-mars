"use client";

import { TerraformingMarsCard, CardValuation } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TMCardProps {
  card: TerraformingMarsCard;
  valuation?: CardValuation;
  selected?: boolean;
  recommended?: boolean;
  dimmed?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

// Card type -> background color mapping (matches real TM card colors)
const cardTypeBg: Record<string, string> = {
  event: "from-red-800 to-red-900",
  automated: "from-green-800 to-green-900",
  active: "from-blue-800 to-blue-900",
  prelude: "from-pink-700 to-pink-900",
};

const cardTypeBorder: Record<string, string> = {
  event: "border-red-600",
  automated: "border-green-600",
  active: "border-blue-600",
  prelude: "border-pink-600",
};

const cardTypeBannerBg: Record<string, string> = {
  event: "bg-red-700",
  automated: "bg-green-700",
  active: "bg-blue-700",
  prelude: "bg-pink-600",
};

// Tag visual config
const tagConfig: Record<string, { bg: string; text: string; label: string }> = {
  building: { bg: "bg-amber-700", text: "text-white", label: "B" },
  space: { bg: "bg-gray-900 ring-1 ring-gray-500", text: "text-white", label: "S" },
  power: { bg: "bg-purple-600", text: "text-white", label: "P" },
  science: { bg: "bg-pink-500", text: "text-white", label: "Sc" },
  plant: { bg: "bg-green-600", text: "text-white", label: "Pl" },
  microbe: { bg: "bg-lime-500", text: "text-black", label: "Mi" },
  animal: { bg: "bg-emerald-500", text: "text-white", label: "An" },
  city: { bg: "bg-blue-700", text: "text-white", label: "Ci" },
  earth: { bg: "bg-cyan-500", text: "text-black", label: "E" },
  jovian: { bg: "bg-orange-500", text: "text-white", label: "J" },
  venus: { bg: "bg-sky-300", text: "text-black", label: "V" },
  wild: { bg: "bg-white", text: "text-black", label: "W" },
};

// Resource display config
const resourceConfig: Record<string, { bg: string; text: string; label: string }> = {
  megacredits: { bg: "bg-yellow-600", text: "text-white", label: "MC" },
  steel: { bg: "bg-amber-800", text: "text-white", label: "Fe" },
  titanium: { bg: "bg-gray-700", text: "text-white", label: "Ti" },
  plants: { bg: "bg-green-600", text: "text-white", label: "Pl" },
  energy: { bg: "bg-purple-600", text: "text-white", label: "En" },
  heat: { bg: "bg-red-600", text: "text-white", label: "He" },
};

const ratingConfig: Record<string, { bg: string; text: string }> = {
  S: { bg: "bg-yellow-500", text: "text-black" },
  A: { bg: "bg-green-500", text: "text-white" },
  B: { bg: "bg-blue-500", text: "text-white" },
  C: { bg: "bg-gray-500", text: "text-white" },
  D: { bg: "bg-orange-500", text: "text-white" },
  F: { bg: "bg-red-500", text: "text-white" },
};

function formatRequirements(req: NonNullable<TerraformingMarsCard["requirements"]>): string {
  const parts: string[] = [];
  if (req.minTemperature !== undefined) parts.push(`${req.minTemperature}°C`);
  if (req.maxTemperature !== undefined) parts.push(`max ${req.maxTemperature}°C`);
  if (req.minOxygen !== undefined) parts.push(`${req.minOxygen}% O2`);
  if (req.maxOxygen !== undefined) parts.push(`max ${req.maxOxygen}% O2`);
  if (req.minOceans !== undefined) parts.push(`${req.minOceans} oceani`);
  if (req.maxOceans !== undefined) parts.push(`max ${req.maxOceans} oceani`);
  if (req.tag) parts.push(`${req.tag.count}x ${req.tag.tag}`);
  if (req.minProduction) {
    for (const [res, amount] of Object.entries(req.minProduction)) {
      parts.push(`prod. ${res} ${amount}`);
    }
  }
  return parts.join(", ");
}

export function TMCard({
  card,
  valuation,
  selected,
  recommended,
  dimmed,
  onClick,
  compact,
}: TMCardProps) {
  const hasProduction = card.effects.production && Object.values(card.effects.production).some(v => v !== 0);
  const hasGlobalEffects = card.effects.oceanTiles || card.effects.temperatureSteps || card.effects.oxygenSteps || card.effects.greeneryTiles || card.effects.cityTiles;
  const hasResources = card.effects.resources && Object.values(card.effects.resources).some(v => v !== 0);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-xl overflow-hidden transition-all duration-200",
        "border-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        cardTypeBorder[card.type] || "border-gray-600",
        selected && "ring-2 ring-amber-400 ring-offset-2 ring-offset-background",
        recommended && "ring-2 ring-green-400 ring-offset-2 ring-offset-background",
        dimmed && "opacity-40",
        compact ? "min-h-[180px]" : "min-h-[240px]"
      )}
    >
      {/* Card background with gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b opacity-20",
        cardTypeBg[card.type] || "from-gray-800 to-gray-900"
      )} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/95" />

      {/* Content */}
      <div className="relative flex flex-col h-full">
        {/* Top row: Cost + Name banner + Tags */}
        <div className={cn(
          "flex items-center gap-2 px-2 pt-2",
          compact ? "pb-1" : "pb-1.5"
        )}>
          {/* Cost circle */}
          {card.type !== "prelude" && (
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-yellow-600 border-2 border-yellow-400 flex items-center justify-center shadow-md">
              <span className="text-sm font-black text-white">{card.cost}</span>
            </div>
          )}

          {/* Name */}
          <div className={cn(
            "flex-1 min-w-0 rounded-md px-2 py-1",
            cardTypeBannerBg[card.type] || "bg-gray-700",
          )}>
            <span className={cn(
              "font-bold text-white truncate block",
              compact ? "text-xs" : "text-sm"
            )}>
              {card.name}
            </span>
          </div>

          {/* Tags */}
          <div className="flex-shrink-0 flex gap-0.5">
            {card.tags.map((tag, i) => {
              const tc = tagConfig[tag] || { bg: "bg-gray-600", text: "text-white", label: "?" };
              return (
                <div
                  key={i}
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shadow-sm",
                    tc.bg, tc.text
                  )}
                  title={tag}
                >
                  <span className="text-[10px] font-bold leading-none">{tc.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Requirements bar */}
        {card.requirements && (
          <div className="mx-2 mb-1">
            <div className="bg-yellow-900/60 border border-yellow-700/50 rounded px-2 py-0.5 text-[10px] text-yellow-300 text-center font-medium">
              {formatRequirements(card.requirements)}
            </div>
          </div>
        )}

        {/* Card body */}
        <div className={cn("flex-1 px-2 space-y-1.5", compact ? "pb-2" : "pb-2")}>
          {/* Production box */}
          {hasProduction && (
            <div className="bg-amber-950/40 border border-amber-800/40 rounded-lg p-1.5">
              <div className="flex flex-wrap gap-1 justify-center">
                {Object.entries(card.effects.production!).map(([res, amt]) => {
                  if (!amt || amt === 0) return null;
                  const rc = resourceConfig[res] || { bg: "bg-gray-600", text: "text-white", label: res };
                  return (
                    <div key={res} className="flex items-center gap-0.5">
                      <span className={cn(
                        "text-xs font-bold",
                        (amt ?? 0) > 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {(amt ?? 0) > 0 ? "+" : ""}{amt}
                      </span>
                      <span className={cn(
                        "text-[9px] font-bold px-1 py-0.5 rounded",
                        rc.bg, rc.text
                      )}>
                        {rc.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Global parameter effects */}
          {hasGlobalEffects && (
            <div className="flex flex-wrap gap-1 justify-center">
              {card.effects.temperatureSteps ? (
                <span className="text-[10px] bg-red-900/50 text-red-300 px-1.5 py-0.5 rounded border border-red-800/40">
                  +{card.effects.temperatureSteps} Temp
                </span>
              ) : null}
              {card.effects.oxygenSteps ? (
                <span className="text-[10px] bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded border border-green-800/40">
                  +{card.effects.oxygenSteps} O2
                </span>
              ) : null}
              {card.effects.oceanTiles ? (
                <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/40">
                  +{card.effects.oceanTiles} Oceano
                </span>
              ) : null}
              {card.effects.greeneryTiles ? (
                <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  +{card.effects.greeneryTiles} Foresta
                </span>
              ) : null}
              {card.effects.cityTiles ? (
                <span className="text-[10px] bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600/40">
                  +{card.effects.cityTiles} Citta
                </span>
              ) : null}
            </div>
          )}

          {/* Immediate resources */}
          {hasResources && (
            <div className="flex flex-wrap gap-1 justify-center">
              {Object.entries(card.effects.resources!).map(([res, amt]) => {
                if (!amt || amt === 0) return null;
                const rc = resourceConfig[res] || { bg: "bg-gray-600", text: "text-white", label: res };
                return (
                  <div key={res} className="flex items-center gap-0.5">
                    <span className={cn(
                      "text-xs font-bold",
                      (amt ?? 0) > 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {(amt ?? 0) > 0 ? "+" : ""}{amt}
                    </span>
                    <span className={cn(
                      "text-[9px] font-bold px-1 py-0.5 rounded",
                      rc.bg, rc.text
                    )}>
                      {rc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Draw cards */}
          {card.effects.drawCards ? (
            <div className="text-center">
              <span className="text-[10px] bg-sky-900/50 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800/40">
                Pesca {card.effects.drawCards} carte
              </span>
            </div>
          ) : null}

          {/* TR */}
          {card.effects.tr ? (
            <div className="text-center">
              <span className="text-[10px] bg-orange-900/50 text-orange-300 px-1.5 py-0.5 rounded border border-orange-800/40">
                +{card.effects.tr} TR
              </span>
            </div>
          ) : null}

          {/* Description */}
          {card.effects.description && !compact && (
            <p className="text-[10px] text-muted-foreground italic text-center leading-tight line-clamp-2 px-1">
              {card.effects.description}
            </p>
          )}
          {card.effects.description && compact && (
            <p className="text-[10px] text-muted-foreground italic text-center leading-tight line-clamp-1 px-1">
              {card.effects.description}
            </p>
          )}
        </div>

        {/* Bottom bar: VP + Rating */}
        <div className="flex items-center justify-between px-2 pb-2">
          {/* VP badge */}
          <div>
            {card.effects.vp !== undefined && card.effects.vp !== 0 && (
              <div className="bg-orange-800 border border-orange-600 rounded px-1.5 py-0.5 shadow-sm">
                <span className="text-xs font-black text-orange-200">{card.effects.vp} VP</span>
              </div>
            )}
            {card.effects.vpPerResource && (
              <div className="bg-orange-800 border border-orange-600 rounded px-1.5 py-0.5 shadow-sm">
                <span className="text-[9px] font-bold text-orange-200">
                  1VP/{card.effects.vpPerResource.per} {card.effects.vpPerResource.resource}
                </span>
              </div>
            )}
            {card.effects.vpPerTag && (
              <div className="bg-orange-800 border border-orange-600 rounded px-1.5 py-0.5 shadow-sm">
                <span className="text-[9px] font-bold text-orange-200">
                  1VP/{card.effects.vpPerTag.per} {card.effects.vpPerTag.tag}
                </span>
              </div>
            )}
          </div>

          {/* Rating + net value */}
          {valuation && (
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-xs font-mono font-bold",
                valuation.netValue >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {valuation.netValue >= 0 ? "+" : ""}{valuation.netValue}
              </span>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shadow-md font-black text-sm",
                ratingConfig[valuation.rating]?.bg || "bg-gray-500",
                ratingConfig[valuation.rating]?.text || "text-white"
              )}>
                {valuation.rating}
              </div>
            </div>
          )}
        </div>

        {/* Selection / Recommendation labels */}
        {selected && (
          <div className="absolute top-1 right-1 bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
            SELEZIONATA
          </div>
        )}
        {recommended && (
          <div className="absolute top-1 right-1 bg-green-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
            CONSIGLIATA
          </div>
        )}
      </div>
    </button>
  );
}
