"use client";

import { useState, useMemo, useCallback } from "react";
import { ALL_CARDS } from "@/lib/cards-data";
import { GameSettings, DEFAULT_GAME_SETTINGS, TerraformingMarsCard } from "@/lib/types";
import { evaluateCard } from "@/lib/valuation";
import { drawPreludeCards, simulatePreludeDraft, PreludeDraftResult } from "@/lib/draft-simulator";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSettingsPanel } from "@/components/GameSettingsPanel";
import { CardValueBadge } from "@/components/CardValueBadge";
import { TagBadge } from "@/components/TagBadge";
import { NavBar } from "@/components/NavBar";
import { TMCard } from "@/components/TMCard";

export default function PreludeDraftPage() {
  const [settings, setSettings] = useLocalStorage<GameSettings>("tm-settings", DEFAULT_GAME_SETTINGS);
  const [drawnCards, setDrawnCards] = useState<TerraformingMarsCard[] | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [draftResult, setDraftResult] = useState<PreludeDraftResult | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleDraw = useCallback(() => {
    const cards = drawPreludeCards(ALL_CARDS, 4);
    setDrawnCards(cards);
    setSelectedCards(new Set());
    setDraftResult(null);
    setShowRecommendation(false);
  }, []);

  const toggleCard = useCallback((cardId: number) => {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else if (next.size < 2) {
        next.add(cardId);
      }
      return next;
    });
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!drawnCards) return;
    const result = simulatePreludeDraft(drawnCards, settings);
    setDraftResult(result);
    setShowRecommendation(true);
  }, [drawnCards, settings]);

  // Evaluate user's selection
  const userPick = useMemo(() => {
    if (!drawnCards || selectedCards.size !== 2) return null;
    const kept = drawnCards.filter((c) => selectedCards.has(c.id));
    const keptValuations = kept.map((c) => evaluateCard(c, settings));
    const totalNet = keptValuations.reduce((s, v) => s + v.netValue, 0);
    return {
      kept: keptValuations,
      totalNet: Math.round(totalNet * 10) / 10,
    };
  }, [drawnCards, selectedCards, settings]);

  // Best pick card IDs for highlighting
  const bestPickCardIds = useMemo(() => {
    if (!draftResult) return new Set<number>();
    return new Set(draftResult.bestPick.kept.map((v) => v.card.id));
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
                <p className="font-semibold text-amber-400 text-sm mb-2">Simulatore Preludi</p>
                <p>1. Premi &quot;Pesca 4 Preludi&quot; per simulare la pescata</p>
                <p>2. Seleziona 2 preludi da tenere (sono gratuiti)</p>
                <p>3. Premi &quot;Analizza&quot; per vedere la coppia ottimale</p>
                <p>4. Il sistema valuta tutte le 6 combinazioni possibili</p>
              </CardContent>
            </Card>
          </div>

          {/* Center: Draft area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Actions */}
            <div className="flex gap-3 items-center">
              <Button onClick={handleDraw} className="bg-purple-700 hover:bg-purple-600">
                Pesca 4 Preludi
              </Button>
              {drawnCards && (
                <Button onClick={handleAnalyze} variant="outline">
                  Analizza coppia ottimale
                </Button>
              )}
              {selectedCards.size > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedCards.size}/2 selezionati
                  {userPick && (
                    <>
                      {" "}| Valore netto:{" "}
                      <span className={`font-mono ${userPick.totalNet >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {userPick.totalNet >= 0 ? "+" : ""}{userPick.totalNet} MC
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Drawn prelude cards */}
            {drawnCards && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {drawnCards.map((card) => {
                  const valuation = evaluateCard(card, settings);
                  const isSelected = selectedCards.has(card.id);
                  const isBestPick = showRecommendation && bestPickCardIds.has(card.id);
                  const isNotRecommended = showRecommendation && !bestPickCardIds.has(card.id);

                  return (
                    <TMCard
                      key={card.id}
                      card={card}
                      valuation={valuation}
                      selected={isSelected}
                      recommended={isBestPick && !isSelected}
                      dimmed={isNotRecommended}
                      onClick={() => toggleCard(card.id)}
                    />
                  );
                })}
              </div>
            )}

            {/* Analysis results */}
            {draftResult && showRecommendation && (
              <div className="space-y-4">
                {/* Best pick */}
                <Card className="border-green-800/50 bg-green-950/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-400">
                      Coppia ottimale
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {draftResult.bestPick.kept.map((v) => (
                        <div key={v.card.id} className="bg-green-950/20 rounded-lg p-3 border border-green-800/30">
                          <div className="font-medium">{v.card.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <CardValueBadge rating={v.rating} netValue={v.netValue} />
                          </div>
                          {v.card.effects.production && (
                            <div className="flex gap-2 mt-1 text-xs">
                              {Object.entries(v.card.effects.production).map(([res, amt]) =>
                                amt !== 0 ? (
                                  <span key={res} className={`font-mono ${(amt ?? 0) > 0 ? "text-green-400" : "text-red-400"}`}>
                                    {(amt ?? 0) > 0 ? "+" : ""}{amt} {res.slice(0, 2).toUpperCase()}/gen
                                  </span>
                                ) : null
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Synergies */}
                    {draftResult.bestPick.synergies.length > 0 && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 font-semibold">Sinergie:</div>
                        {draftResult.bestPick.synergies.map((s, i) => (
                          <div key={i} className="text-xs text-green-400">
                            + {s.description}: <span className="font-mono">+{Math.round(s.bonus)} MC</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-green-800/30 pt-3">
                      <div className="text-muted-foreground text-xs">Valore netto totale</div>
                      <div className={`text-xl font-mono font-bold ${draftResult.bestPick.score >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {draftResult.bestPick.score >= 0 ? "+" : ""}{draftResult.bestPick.score} MC
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compare user selection vs best */}
                {userPick && (
                  <Card className="border-blue-800/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-400">Confronto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">La tua scelta</div>
                          <div className={`text-2xl font-mono font-bold ${userPick.totalNet >= 0 ? "text-blue-400" : "text-red-400"}`}>
                            {userPick.totalNet >= 0 ? "+" : ""}{userPick.totalNet} MC
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Coppia ottimale</div>
                          <div className={`text-2xl font-mono font-bold ${draftResult.bestPick.score >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {draftResult.bestPick.score >= 0 ? "+" : ""}{draftResult.bestPick.score} MC
                          </div>
                        </div>
                      </div>

                      {(() => {
                        const diff = Math.round((userPick.totalNet - draftResult.bestPick.score) * 10) / 10;
                        if (diff === 0) {
                          return (
                            <div className="mt-3 text-center text-green-400 font-semibold">
                              Scelta perfetta! Hai trovato la coppia ottimale.
                            </div>
                          );
                        }
                        return (
                          <div className="mt-3 text-center text-sm">
                            <span className="text-muted-foreground">Differenza: </span>
                            <span className={`font-mono font-bold ${diff > 0 ? "text-green-400" : "text-orange-400"}`}>
                              {diff > 0 ? "+" : ""}{diff} MC
                            </span>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}

                {/* All combinations */}
                <Card className="border-amber-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-amber-400">
                      Tutte le combinazioni ({draftResult.allCombinations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {draftResult.allCombinations.map((hand, i) => (
                        <div key={i} className="flex items-center justify-between text-sm border-b border-border pb-2">
                          <div className="text-muted-foreground">
                            #{i + 1}: {hand.kept.map((v) => v.card.name).join(" + ")}
                          </div>
                          <span className={`font-mono font-bold ${hand.score >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {hand.score >= 0 ? "+" : ""}{hand.score} MC
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Empty state */}
            {!drawnCards && (
              <Card className="border-purple-800/50">
                <CardContent className="py-16 text-center">
                  <div className="text-4xl mb-4">&#127968;</div>
                  <h2 className="text-xl font-semibold text-purple-400 mb-2">Simulatore Preludi</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Simula la scelta dei Preludi di Terraforming Mars. Pesca 4 carte Preludio,
                    scegli 2 da tenere, e scopri quale coppia massimizza il valore iniziale
                    della tua partita.
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
