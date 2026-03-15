"use client";

import { GameSettings } from "@/lib/types";
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

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Parametri globali disponibili</label>
          <div className="flex gap-3">
            <ToggleButton
              label="Ossigeno"
              active={settings.oxygenAvailable}
              onClick={() => onChange({ ...settings, oxygenAvailable: !settings.oxygenAvailable })}
              activeColor="bg-green-700"
            />
            <ToggleButton
              label="Temperatura"
              active={settings.temperatureAvailable}
              onClick={() => onChange({ ...settings, temperatureAvailable: !settings.temperatureAvailable })}
              activeColor="bg-orange-700"
            />
            <ToggleButton
              label="Oceani"
              active={settings.oceansAvailable}
              onClick={() => onChange({ ...settings, oceansAvailable: !settings.oceansAvailable })}
              activeColor="bg-blue-700"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
  activeColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
        active ? `${activeColor} text-white` : "bg-secondary text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
