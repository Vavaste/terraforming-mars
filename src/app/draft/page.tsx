"use client";

import { useState, useMemo, useCallback } from "react";
import { ALL_CARDS } from "@/lib/cards-data";
import { GameSettings, DEFAULT_GAME_SETTINGS, TerraformingMarsCard } from "@/lib/types";
import { evaluateCard } from "@/lib/valuation";
import { drawCards, simulateDraft, DraftResult, DraftHand } from "@/lib/draft-simulator";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSettingsPanel } from "@/components/GameSettingsPanel";
import { CardValueBadge } from "@/components/CardValueBadge";
import { TagBadge } from "@/components/TagBadge";
import { CardTypeIcon } from "@/components/CardTypeIcon";
import { NavBar } from "@/components/NavBar";
import { TMCard } from "@/components/TMCard";

export default function DraftPage() {
  const [settings, setSettings] = useLocalStorage<GameSettings>("tm-settings", DEFAULT_GAME_SETTINGS);
  const [drawnCards, setDrawnCards] = useState<TerraformingMarsCard[] | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [draftResult, setDraftResult] = useState<DraftResult | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleDraw = useCallback(() => {
    const cards = drawCards(ALL_CARDS, 10);
    setDrawnCards(cards);
    setSelectedCards(new Set());
    setDraftResult(null);
    setShowRecommendation(false);
  }, []);

  const toggleCard = useCallback((cardId: number) => {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!drawnCards) return;
    const result = simulateDraft(drawnCards, settings);
    setDraftResult(result);
    setShowRecommendation(true);
  }, [drawnCards, settings]);

  // Evaluate user's selection
  const userHand = useMemo(() => {
    if (!drawnCards) return null;
    const kept = drawnCards.filter((c) => selectedCards.has(c.id));
    const discarded = drawnCards.filter((c) => !selectedCards.has(c.id));
    const keptValuations = kept.map((c) => evaluateCard(c, settings));
    const discardedValuations = discarded.map((c) => evaluateCard(c, settings));
    const keepCost = kept.length * 3;
    const totalNet = keptValuations.reduce((s, v) => s + v.netValue, 0) - keepCost;
    return {
      kept: keptValuations,
      discarded: discardedValuations,
      keepCost,
      totalNet: Math.round(totalNet * 10) / 10,
    };
  }, [drawnCards, selectedCards, settings]);

  // Best hand card IDs for highlighting
  const bestHandCardIds = useMemo(() => {
    if (!draftResult) return new Set<number>();
    return new Set(draftResult.bestHand.kept.map((v) => v.card.id));
  }, [draftResult]);

  return (
    <div className="min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Settings */}
          <div className="lg:col-span-3 space-y-4">
            <GameSettingsPanel settings={settings} onChange={setSettings} />

            <Card className="border-amber-800/50">
              <CardContent className="pt-4 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-amber-400 text-sm mb-2">Come funziona</p>
                <p>1. Premi &quot;Pesca 10 carte&quot; per simulare la pescata iniziale</p>
                <p>2. Seleziona le carte che vorresti tenere (3 MC ciascuna)</p>
                <p>3. Premi &quot;Analizza&quot; per vedere la mano ottimale</p>
                <p>4. Il sistema calcola tutte le 1024 combinazioni e trova quella col miglior valore netto</p>
              </CardContent>
            </Card>
          </div>

          {/* Center: Draft area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Actions */}
            <div className="flex gap-3 items-center">
              <Button onClick={handleDraw} className="bg-amber-700 hover:bg-amber-600">
                Pesca 10 carte
              </Button>
              {drawnCards && (
                <Button onClick={handleAnalyze} variant="outline">
                  Analizza mano ottimale
                </Button>
              )}
              {userHand && selectedCards.size > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedCards.size} carte selezionate |
                  Costo: <span className="text-red-400 font-mono">-{userHand.keepCost} MC</span> |
                  Valore netto: <span className={`font-mono ${userHand.totalNet >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {userHand.totalNet >= 0 ? "+" : ""}{userHand.totalNet} MC
                  </span>
                </div>
              )}
            </div>

            {/* Drawn cards grid */}
            {drawnCards && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {drawnCards.map((card) => {
                  const valuation = evaluateCard(card, settings);
                  const isSelected = selectedCards.has(card.id);
                  const isBestPick = showRecommendation && bestHandCardIds.has(card.id);
                  const isNotRecommended = showRecommendation && !bestHandCardIds.has(card.id);

                  return (
                    <TMCard
                      key={card.id}
                      card={card}
                      valuation={valuation}
                      selected={isSelected}
                      recommended={isBestPick && !isSelected}
                      dimmed={isNotRecommended}
                      onClick={() => toggleCard(card.id)}
                      compact
                    />
                  );
                })}
              </div>
            )}

            {/* Analysis results */}
            {draftResult && showRecommendation && (
              <div className="space-y-4">
                {/* Best hand */}
                <Card className="border-green-800/50 bg-green-950/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-400">
                      Mano ottimale ({draftResult.bestHand.kept.length} carte)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {draftResult.bestHand.kept.map((v) => (
                        <div key={v.card.id} className="bg-green-950/20 rounded-lg p-2 border border-green-800/30">
                          <div className="font-medium text-sm">{v.card.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-amber-400 font-mono text-xs">{v.card.cost} MC</span>
                            <CardValueBadge rating={v.rating} netValue={v.netValue} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Synergies */}
                    {draftResult.bestHand.synergies.length > 0 && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 font-semibold">Sinergie trovate:</div>
                        {draftResult.bestHand.synergies.map((s, i) => (
                          <div key={i} className="text-xs text-green-400">
                            + {s.description}: <span className="font-mono">+{Math.round(s.bonus)} MC</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Summary */}
                    <div className="border-t border-green-800/30 pt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">Costo mantenimento</div>
                        <div className="text-red-400 font-mono font-bold">
                          -{draftResult.bestHand.totalKeepCost} MC
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Valore netto totale</div>
                        <div
                          className={`font-mono font-bold ${
                            draftResult.bestHand.score >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {draftResult.bestHand.score >= 0 ? "+" : ""}
                          {draftResult.bestHand.score} MC
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Carte scartate</div>
                        <div className="font-mono">{draftResult.bestHand.discarded.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compare: user selection vs best */}
                {selectedCards.size > 0 && userHand && (
                  <Card className="border-blue-800/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-400">Confronto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">La tua scelta</div>
                          <div
                            className={`text-2xl font-mono font-bold ${
                              userHand.totalNet >= 0 ? "text-blue-400" : "text-red-400"
                            }`}
                          >
                            {userHand.totalNet >= 0 ? "+" : ""}
                            {userHand.totalNet} MC
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {selectedCards.size} carte, costo {userHand.keepCost} MC
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Mano ottimale</div>
                          <div
                            className={`text-2xl font-mono font-bold ${
                              draftResult.bestHand.score >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {draftResult.bestHand.score >= 0 ? "+" : ""}
                            {draftResult.bestHand.score} MC
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {draftResult.bestHand.kept.length} carte, costo{" "}
                            {draftResult.bestHand.totalKeepCost} MC
                          </div>
                        </div>
                      </div>

                      {/* Difference */}
                      {(() => {
                        const diff = Math.round((userHand.totalNet - draftResult.bestHand.score) * 10) / 10;
                        if (diff === 0) {
                          return (
                            <div className="mt-3 text-center text-green-400 font-semibold">
                              Scelta perfetta! Hai trovato la mano ottimale.
                            </div>
                          );
                        }
                        return (
                          <div className="mt-3 text-center text-sm">
                            <span className="text-muted-foreground">Differenza: </span>
                            <span className={`font-mono font-bold ${diff > 0 ? "text-green-400" : "text-orange-400"}`}>
                              {diff > 0 ? "+" : ""}{diff} MC
                            </span>
                            {diff < -5 && (
                              <span className="text-muted-foreground ml-2">
                                — Potresti migliorare la selezione
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}

                {/* Top alternatives */}
                <Card className="border-amber-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-amber-400">
                      Top 5 combinazioni alternative
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {draftResult.allCombinations.slice(1, 6).map((hand, i) => (
                        <div key={i} className="flex items-center justify-between text-sm border-b border-border pb-2">
                          <div className="text-muted-foreground">
                            #{i + 2}: {hand.kept.map((v) => v.card.name).join(", ") || "Nessuna carta"}
                          </div>
                          <span
                            className={`font-mono font-bold ${
                              hand.score >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {hand.score >= 0 ? "+" : ""}
                            {hand.score} MC
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Baseline comparisons */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-border">
                    <CardContent className="pt-4 text-center">
                      <div className="text-xs text-muted-foreground">Tieni tutte (10 carte)</div>
                      <div className={`text-lg font-mono font-bold ${draftResult.keepAll.score >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {draftResult.keepAll.score >= 0 ? "+" : ""}{draftResult.keepAll.score} MC
                      </div>
                      <div className="text-xs text-muted-foreground">Costo: {draftResult.keepAll.totalKeepCost} MC</div>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="pt-4 text-center">
                      <div className="text-xs text-muted-foreground">Scarta tutte</div>
                      <div className="text-lg font-mono font-bold text-muted-foreground">
                        0 MC
                      </div>
                      <div className="text-xs text-muted-foreground">Nessun costo</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!drawnCards && (
              <Card className="border-amber-800/50">
                <CardContent className="py-16 text-center">
                  <div className="text-4xl mb-4">&#127915;</div>
                  <h2 className="text-xl font-semibold text-amber-400 mb-2">Simulatore Pescata Iniziale</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Simula la pescata iniziale di Terraforming Mars. Pesca 10 carte, scegli quali tenere (3 MC ciascuna),
                    e scopri se hai fatto la scelta migliore analizzando tutte le 1024 combinazioni possibili.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
