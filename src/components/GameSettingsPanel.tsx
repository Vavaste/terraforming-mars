"use client";

import { GameSettings, isTemperatureMaxed, isOxygenMaxed, isOceansMaxed } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameSettingsPanelProps {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
}

export function GameSettingsPanel({ settings, onChange }: GameSettingsPanelProps) {
  return (
    <Card className="border-amber-800/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-amber-400">Impostazioni Partita</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-muted-foreground">Generazioni rimanenti</label>
            <span className="text-sm font-mono text-amber-400">{settings.generationsRemaining}</span>
          </div>
          <Slider
            value={[settings.generationsRemaining]}
            onValueChange={([v]) => onChange({ ...settings, generationsRemaining: v })}
            min={1}
            max={14}
            step={1}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-muted-foreground">Generazioni totali</label>
            <span className="text-sm font-mono text-amber-400">{settings.totalGenerations}</span>
          </div>
          <Slider
            value={[settings.totalGenerations]}
            onValueChange={([v]) => onChange({ ...settings, totalGenerations: v })}
            min={6}
            max={16}
            step={1}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-muted-foreground">Valore Acciaio (MC)</label>
            <span className="text-sm font-mono text-amber-400">{settings.steelDiscount}</span>
          </div>
          <Slider
            value={[settings.steelDiscount]}
            onValueChange={([v]) => onChange({ ...settings, steelDiscount: v })}
            min={2}
            max={4}
            step={1}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-muted-foreground">Valore Titanio (MC)</label>
            <span className="text-sm font-mono text-amber-400">{settings.titaniumDiscount}</span>
          </div>
          <Slider
            value={[settings.titaniumDiscount]}
            onValueChange={([v]) => onChange({ ...settings, titaniumDiscount: v })}
            min={3}
            max={5}
            step={1}
          />
        </div>

        {/* Global Parameters - actual current values */}
        <div className="border-t border-border pt-4">
          <label className="text-sm font-semibold text-amber-400 mb-3 block">Parametri Globali Attuali</label>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-muted-foreground">Temperatura</label>
                <span className={`text-sm font-mono ${isTemperatureMaxed(settings) ? "text-red-400" : "text-orange-400"}`}>
                  {settings.currentTemperature >= 0 ? "+" : ""}{settings.currentTemperature}°C
                  {isTemperatureMaxed(settings) && " (MAX)"}
                </span>
              </div>
              <Slider
                value={[settings.currentTemperature]}
                onValueChange={([v]) => onChange({ ...settings, currentTemperature: v })}
                min={-30}
                max={8}
                step={2}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>-30°C</span>
                <span>+8°C</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-muted-foreground">Ossigeno</label>
                <span className={`text-sm font-mono ${isOxygenMaxed(settings) ? "text-red-400" : "text-green-400"}`}>
                  {settings.currentOxygen}%
                  {isOxygenMaxed(settings) && " (MAX)"}
                </span>
              </div>
              <Slider
                value={[settings.currentOxygen]}
                onValueChange={([v]) => onChange({ ...settings, currentOxygen: v })}
                min={0}
                max={14}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>14%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-muted-foreground">Oceani piazzati</label>
                <span className={`text-sm font-mono ${isOceansMaxed(settings) ? "text-red-400" : "text-blue-400"}`}>
                  {settings.currentOceans}/9
                  {isOceansMaxed(settings) && " (MAX)"}
                </span>
              </div>
              <Slider
                value={[settings.currentOceans]}
                onValueChange={([v]) => onChange({ ...settings, currentOceans: v })}
                min={0}
                max={9}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>9</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
