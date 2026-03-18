"use client";

import { useState, useMemo, useCallback } from "react";
import { ALL_CARDS } from "@/lib/cards-data";
import { evaluateCard } from "@/lib/valuation";
import { GameSettings, DEFAULT_GAME_SETTINGS, TerraformingMarsCard, CardValuation } from "@/lib/types";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameSettingsPanel } from "@/components/GameSettingsPanel";
import { CardDetail } from "@/components/CardDetail";
import { CardValueBadge } from "@/components/CardValueBadge";
import { TagBadge } from "@/components/TagBadge";
import { CardTypeIcon } from "@/components/CardTypeIcon";
import { NavBar } from "@/components/NavBar";
import { TMCard } from "@/components/TMCard";

type SortBy = "name" | "cost" | "value" | "rating";
type FilterType = "all" | "event" | "automated" | "active" | "prelude";

const ALL_TAGS = ["building", "space", "power", "science", "plant", "microbe", "animal", "city", "earth", "jovian"] as const;

export default function Home() {
  const [settings, setSettings] = useLocalStorage<GameSettings>("tm-settings", DEFAULT_GAME_SETTINGS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterExpansion, setFilterExpansion] = useState<string>("all");
  const [filterTags, setFilterTags] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortBy>("value");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TerraformingMarsCard | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate all valuations
  const valuations = useMemo(() => {
    return ALL_CARDS.map((card) => evaluateCard(card, settings));
  }, [settings]);

  // Filter and sort
  const filteredValuations = useMemo(() => {
    let result = valuations;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.card.name.toLowerCase().includes(q));
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter((v) => v.card.type === filterType);
    }

    // Expansion filter
    if (filterExpansion !== "all") {
      result = result.filter((v) => v.card.expansion === filterExpansion);
    }

    // Tag filter
    if (filterTags.size > 0) {
      result = result.filter((v) =>
        Array.from(filterTags).every((tag) => v.card.tags.includes(tag as never))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = a.card.name.localeCompare(b.card.name);
          break;
        case "cost":
          cmp = a.card.cost - b.card.cost;
          break;
        case "value":
          cmp = a.netValue - b.netValue;
          break;
        case "rating":
          const ratingOrder = { S: 6, A: 5, B: 4, C: 3, D: 2, F: 1 };
          cmp = (ratingOrder[a.rating as keyof typeof ratingOrder] || 0) -
                (ratingOrder[b.rating as keyof typeof ratingOrder] || 0);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [valuations, search, filterType, filterExpansion, filterTags, sortBy, sortAsc]);

  const selectedValuation = useMemo(() => {
    if (!selectedCard) return null;
    return evaluateCard(selectedCard, settings);
  }, [selectedCard, settings]);

  const toggleTag = useCallback((tag: string) => {
    setFilterTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const handleSort = useCallback((key: SortBy) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(false);
    }
  }, [sortBy, sortAsc]);

  // Stats
  const stats = useMemo(() => {
    const ratings = { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const v of valuations) {
      ratings[v.rating as keyof typeof ratings]++;
    }
    const avgValue = valuations.reduce((sum, v) => sum + v.netValue, 0) / valuations.length;
    return { ratings, avgValue: Math.round(avgValue * 10) / 10, total: valuations.length };
  }, [valuations]);

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Stats bar */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-4 text-sm">
          <span className="text-muted-foreground">
            {stats.total} carte | Media: <span className="text-amber-400 font-mono">{stats.avgValue} MC</span>
          </span>
          <div className="flex gap-2">
            {Object.entries(stats.ratings).map(([rating, count]) => (
              <span key={rating} className="text-muted-foreground">
                {rating}: <span className="text-foreground">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar: Settings */}
          <div className="lg:col-span-3 space-y-4">
            <Button
              variant="outline"
              className="w-full lg:hidden"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "Nascondi" : "Mostra"} Impostazioni
            </Button>
            <div className={`space-y-4 ${showSettings ? "" : "hidden lg:block"}`}>
              <GameSettingsPanel settings={settings} onChange={setSettings} />

              {/* Legend */}
              <Card className="border-amber-800/50">
                <CardContent className="pt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-amber-400 mb-2">Legenda Rating</h3>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span><span className="text-yellow-500 font-bold">S</span> = Eccellente (+20 MC)</span>
                    <span><span className="text-green-500 font-bold">A</span> = Ottima (+10 MC)</span>
                    <span><span className="text-blue-500 font-bold">B</span> = Buona (+3 MC)</span>
                    <span><span className="text-gray-500 font-bold">C</span> = Media (-3/+3)</span>
                    <span><span className="text-orange-500 font-bold">D</span> = Scarsa (-10 MC)</span>
                    <span><span className="text-red-500 font-bold">F</span> = Pessima (&lt;-10)</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2 text-xs text-muted-foreground space-y-1">
                    <p>Valori basati su:</p>
                    <p>1 VP = 13 MC</p>
                    <p>1 TR = 13 MC + gen rimanenti</p>
                    <p>8 piante = 1 foresta = 1 VP</p>
                    <p>8 calore = 1 temp = 1 TR</p>
                    <p>Acciaio = {settings.steelDiscount} MC</p>
                    <p>Titanio = {settings.titaniumDiscount} MC</p>
                    <p>Temp: {settings.currentTemperature}°C | O2: {settings.currentOxygen}% | Oceani: {settings.currentOceans}/9</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Center: Card list */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search & Filters */}
            <div className="space-y-3">
              <Input
                placeholder="Cerca carte..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-secondary"
              />

              <div className="flex gap-2 flex-wrap">
                {(["all", "event", "automated", "active", "prelude"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type === "all" ? "Tutte" : type === "event" ? "Eventi" : type === "automated" ? "Automatiche" : type === "active" ? "Attive" : "Preludi"}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {([
                  ["all", "Tutte"],
                  ["base", "Base"],
                  ["prelude", "Preludio"],
                  ["colonies", "Colonie"],
                ] as const).map(([exp, label]) => (
                  <Button
                    key={exp}
                    variant={filterExpansion === exp ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterExpansion(exp)}
                    className="text-xs h-7"
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`transition-opacity ${filterTags.has(tag) ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                  >
                    <TagBadge tag={tag} />
                  </button>
                ))}
              </div>

              {/* Sort buttons */}
              <div className="flex gap-2 text-xs">
                <span className="text-muted-foreground self-center">Ordina:</span>
                {([
                  ["value", "Valore"],
                  ["cost", "Costo"],
                  ["name", "Nome"],
                  ["rating", "Rating"],
                ] as const).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={sortBy === key ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleSort(key)}
                    className="text-xs h-7"
                  >
                    {label} {sortBy === key && (sortAsc ? "\u2191" : "\u2193")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {filteredValuations.length} carte trovate
            </div>

            {/* Card list */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {filteredValuations.map((valuation) => (
                <TMCard
                  key={valuation.card.id}
                  card={valuation.card}
                  valuation={valuation}
                  selected={selectedCard?.id === valuation.card.id}
                  onClick={() => setSelectedCard(valuation.card)}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Right: Card detail */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              {selectedValuation ? (
                <CardDetail valuation={selectedValuation} settings={settings} />
              ) : (
                <Card className="border-amber-800/50">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Seleziona una carta per vedere i dettagli e il calcolo del valore
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

