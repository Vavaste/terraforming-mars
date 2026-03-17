export type CardType = "event" | "automated" | "active" | "prelude";
export type Tag = "building" | "space" | "power" | "science" | "plant" | "microbe" | "animal" | "city" | "earth" | "jovian" | "venus" | "wild";
export type ResourceType = "megacredits" | "steel" | "titanium" | "plants" | "energy" | "heat";
export type Expansion = "base" | "corporate_era" | "prelude" | "venus" | "colonies" | "turmoil";

export interface Production {
  megacredits?: number;
  steel?: number;
  titanium?: number;
  plants?: number;
  energy?: number;
  heat?: number;
}

export interface CardEffect {
  production?: Production;
  tr?: number;
  resources?: Partial<Record<ResourceType, number>>;
  drawCards?: number;
  oceanTiles?: number;
  temperatureSteps?: number;
  oxygenSteps?: number;
  greeneryTiles?: number;
  cityTiles?: number;
  removeResources?: Partial<Record<ResourceType, number>>;
  // For active cards - per action/trigger
  actionProduction?: Production;
  actionResources?: Partial<Record<ResourceType, number>>;
  cardDiscount?: number;
  // VP
  vp?: number;
  vpPerResource?: { resource: string; per: number };
  vpPerTag?: { tag: string; per: number };
  vpPer2Resources?: { resource: string };
  description?: string;
}

export interface Requirement {
  minTemperature?: number;
  maxTemperature?: number;
  minOxygen?: number;
  maxOxygen?: number;
  minOceans?: number;
  maxOceans?: number;
  minProduction?: Partial<Record<ResourceType, number>>;
  tag?: { tag: string; count: number };
}

export interface TerraformingMarsCard {
  id: number;
  name: string;
  cost: number;
  type: CardType;
  tags: Tag[];
  expansion: Expansion;
  requirements?: Requirement;
  effects: CardEffect;
  cardNumber: string;
}

export interface GameSettings {
  generationsRemaining: number;
  totalGenerations: number;
  oxygenAvailable: boolean; // can still raise oxygen
  temperatureAvailable: boolean; // can still raise temperature
  oceansAvailable: boolean; // oceans still placeable
  steelDiscount: number; // MC value of steel (default 2)
  titaniumDiscount: number; // MC value of titanium (default 3)
}

export interface CardValuation {
  card: TerraformingMarsCard;
  totalValue: number;
  costMC: number;
  netValue: number;
  rating: string;
  breakdown: {
    productionValue: number;
    immediateResourceValue: number;
    trValue: number;
    vpValue: number;
    globalParameterValue: number;
    cardDiscountValue: number;
    tagValue: number;
    requirementPenalty: number;
  };
  breakevenGeneration: number | null;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  generationsRemaining: 7,
  totalGenerations: 12,
  oxygenAvailable: true,
  temperatureAvailable: true,
  oceansAvailable: true,
  steelDiscount: 2,
  titaniumDiscount: 3,
};
