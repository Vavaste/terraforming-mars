"use client";

import { CardValuation, GameSettings } from "@/lib/types";
import { generateCardExplanation } from "@/lib/card-explanation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagBadge } from "./TagBadge";
import { CardTypeIcon } from "./CardTypeIcon";
import { CardValueBadge } from "./CardValueBadge";
import { useState } from "react";

interface CardDetailProps {
  valuation: CardValuation;
  settings: GameSettings;
}

export function CardDetail({ valuation, settings }: CardDetailProps) {
  const { card, breakdown, breakevenGeneration } = valuation;
  const prod = card.effects.production;
  const [showExplanation, setShowExplanation] = useState(true);
  const explanation = generateCardExplanation(valuation, settings);

  return (
    <Card className="border-amber-800/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{card.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <CardTypeIcon type={card.type} />
              <span className="text-amber-400 font-mono font-bold">{card.cost} MC</span>
              {card.expansion !== "base" && (
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  {card.expansion === "prelude" ? "Preludio" : card.expansion === "colonies" ? "Colonie" : card.expansion}
                </span>
              )}
            </div>
          </div>
          <CardValueBadge rating={valuation.rating} netValue={valuation.netValue} />
        </div>
        <div className="flex gap-1.5 mt-2">
          {card.tags.map((tag, i) => (
            <TagBadge key={i} tag={tag} />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Requirements */}
        {card.requirements && (
          <div className="text-sm">
            <span className="text-muted-foreground">Requisiti: </span>
            <span className="text-yellow-400">
              {formatRequirements(card.requirements)}
            </span>
          </div>
        )}

        {/* Production */}
        {prod && Object.keys(prod).length > 0 && (
          <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800/30">
            <div className="text-xs text-muted-foreground mb-2">Produzione</div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(prod).map(([resource, amount]) => (
                amount !== 0 && (
                  <div key={resource} className="flex items-center gap-1.5">
                    <ResourceIcon resource={resource} />
                    <span className={`font-mono text-sm ${(amount ?? 0) > 0 ? "text-green-400" : "text-red-400"}`}>
                      {(amount ?? 0) > 0 ? "+" : ""}{amount}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Effects description */}
        {card.effects.description && (
          <p className="text-sm text-muted-foreground italic">
            {card.effects.description}
          </p>
        )}

        {/* VP */}
        {(card.effects.vp !== undefined && card.effects.vp !== 0) && (
          <div className="text-sm">
            <span className="text-muted-foreground">Punti Vittoria: </span>
            <span className="text-yellow-400 font-bold">{card.effects.vp} VP</span>
          </div>
        )}

        {/* Value Breakdown */}
        <div className="border-t border-border pt-3">
          <div className="text-xs text-muted-foreground mb-2 font-semibold">Analisi Valore (MC)</div>
          <div className="grid grid-cols-2 gap-y-1.5 text-sm">
            <BreakdownRow label="Produzione" value={breakdown.productionValue} />
            <BreakdownRow label="Risorse immediate" value={breakdown.immediateResourceValue} />
            <BreakdownRow label="Terraform Rating" value={breakdown.trValue} />
            <BreakdownRow label="Punti Vittoria" value={breakdown.vpValue} />
            <BreakdownRow label="Parametri globali" value={breakdown.globalParameterValue} />
            <BreakdownRow label="Sconto carte" value={breakdown.cardDiscountValue} />
            <BreakdownRow label="Sinergia tag" value={breakdown.tagValue} />
          </div>
          <div className="flex justify-between mt-3 pt-2 border-t border-border font-semibold">
            <span>Valore totale</span>
            <span className="text-amber-400 font-mono">{valuation.totalValue} MC</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm">Costo</span>
            <span className="text-red-400 font-mono text-sm">-{valuation.costMC} MC</span>
          </div>
          <div className="flex justify-between mt-1 font-bold text-lg">
            <span>Valore netto</span>
            <span className={`font-mono ${valuation.netValue >= 0 ? "text-green-400" : "text-red-400"}`}>
              {valuation.netValue >= 0 ? "+" : ""}{valuation.netValue} MC
            </span>
          </div>

          {breakevenGeneration !== null && (
            <div className="mt-2 text-sm text-muted-foreground">
              Pareggio dopo <span className="text-amber-400 font-bold">{breakevenGeneration}</span> generazion{breakevenGeneration === 1 ? "e" : "i"}
            </div>
          )}
        </div>

        {/* Explanation Section */}
        <div className="border-t border-border pt-3">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            {showExplanation ? "\u25BC" : "\u25B6"} Spiegazione dettagliata
          </button>
          {showExplanation && (
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3">
              {explanation.map((line, i) => {
                if (line === "") return <div key={i} className="h-2" />;
                if (line.startsWith("Verdetto:")) {
                  const isGood = valuation.netValue >= 3;
                  const isBad = valuation.netValue < -3;
                  return (
                    <p key={i} className={`font-semibold text-sm ${isGood ? "text-green-400" : isBad ? "text-red-400" : "text-yellow-400"}`}>
                      {line}
                    </p>
                  );
                }
                if (line.startsWith("Attenzione:")) {
                  return <p key={i} className="text-red-400 font-medium">{line}</p>;
                }
                if (line.startsWith("  ")) {
                  return <p key={i} className="pl-3 text-foreground/70">{line}</p>;
                }
                return <p key={i} className="text-foreground/80">{line}</p>;
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  if (value === 0) return null;
  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-mono ${value > 0 ? "text-green-400" : "text-red-400"}`}>
        {value > 0 ? "+" : ""}{value}
      </span>
    </>
  );
}

function ResourceIcon({ resource }: { resource: string }) {
  const icons: Record<string, { emoji: string; label: string }> = {
    megacredits: { emoji: "$", label: "MC" },
    steel: { emoji: "Fe", label: "Acciaio" },
    titanium: { emoji: "Ti", label: "Titanio" },
    plants: { emoji: "Pl", label: "Piante" },
    energy: { emoji: "En", label: "Energia" },
    heat: { emoji: "He", label: "Calore" },
  };
  const icon = icons[resource] || { emoji: "?", label: resource };
  return (
    <span className="text-xs bg-secondary rounded px-1.5 py-0.5" title={icon.label}>
      {icon.emoji}
    </span>
  );
}

function formatRequirements(req: NonNullable<CardDetailProps["valuation"]["card"]["requirements"]>): string {
  const parts: string[] = [];
  if (req.minTemperature !== undefined) parts.push(`Temp >= ${req.minTemperature}°C`);
  if (req.maxTemperature !== undefined) parts.push(`Temp <= ${req.maxTemperature}°C`);
  if (req.minOxygen !== undefined) parts.push(`O2 >= ${req.minOxygen}%`);
  if (req.maxOxygen !== undefined) parts.push(`O2 <= ${req.maxOxygen}%`);
  if (req.minOceans !== undefined) parts.push(`Oceani >= ${req.minOceans}`);
  if (req.maxOceans !== undefined) parts.push(`Oceani <= ${req.maxOceans}`);
  if (req.tag) parts.push(`${req.tag.count}x ${req.tag.tag}`);
  if (req.minProduction) {
    for (const [res, amount] of Object.entries(req.minProduction)) {
      parts.push(`Prod. ${res} >= ${amount}`);
    }
  }
  return parts.join(", ");
}
