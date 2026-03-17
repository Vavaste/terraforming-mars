import { CardValuation, GameSettings } from "./types";

const resourceNames: Record<string, string> = {
  megacredits: "MC",
  steel: "acciaio",
  titanium: "titanio",
  plants: "piante",
  energy: "energia",
  heat: "calore",
};

/**
 * Generate a detailed Italian explanation of why a card has its calculated value.
 * Each line explains one component of the valuation formula.
 */
export function generateCardExplanation(valuation: CardValuation, settings: GameSettings): string[] {
  const { card, breakdown, breakevenGeneration } = valuation;
  const lines: string[] = [];

  // --- COST ---
  if (card.type === "prelude") {
    lines.push(`Questa carta Preludio e gratuita (0 MC) e si gioca prima dell'inizio della partita.`);
  } else {
    lines.push(`Costo: ${card.cost} MC per giocare questa carta.`);
  }

  // --- PRODUCTION ---
  if (breakdown.productionValue !== 0 && card.effects.production) {
    const prodParts: string[] = [];
    for (const [res, amt] of Object.entries(card.effects.production)) {
      if (amt === undefined || amt === 0) continue;
      const resName = resourceNames[res] || res;
      const sign = amt > 0 ? "+" : "";
      const mcPerUnit = res === "megacredits" ? 1 :
        res === "steel" ? settings.steelDiscount :
        res === "titanium" ? settings.titaniumDiscount :
        res === "plants" ? (settings.oxygenAvailable ? 3.3 : 1.6) :
        res === "energy" || res === "heat" ? (settings.temperatureAvailable ? 1.6 : 0.5) : 1;

      prodParts.push(
        `${sign}${amt} ${resName}/turno (${amt > 0 ? "" : ""}${amt} x ${mcPerUnit.toFixed(1)} MC x ${settings.generationsRemaining} gen = ${(amt * mcPerUnit * settings.generationsRemaining).toFixed(1)} MC)`
      );
    }
    lines.push(`Produzione vale ${breakdown.productionValue} MC totali:`);
    for (const p of prodParts) {
      lines.push(`  ${p}`);
    }
  }

  // --- IMMEDIATE RESOURCES ---
  if (breakdown.immediateResourceValue !== 0) {
    const parts: string[] = [];
    if (card.effects.resources) {
      for (const [res, amt] of Object.entries(card.effects.resources)) {
        if (amt === undefined || amt === 0) continue;
        const resName = resourceNames[res] || res;
        parts.push(`${amt} ${resName}`);
      }
    }
    if (card.effects.drawCards) {
      parts.push(`${card.effects.drawCards} carte (${card.effects.drawCards * 3} MC)`);
    }
    lines.push(`Risorse immediate: ${parts.join(", ")} = ${breakdown.immediateResourceValue} MC`);
  }

  // --- TR ---
  if (breakdown.trValue !== 0 && card.effects.tr) {
    lines.push(
      `Terraform Rating: +${card.effects.tr} TR = ${card.effects.tr} VP a fine partita (${card.effects.tr * 13} MC) + ${card.effects.tr} MC/gen per ${settings.generationsRemaining} gen (${card.effects.tr * settings.generationsRemaining} MC) = ${breakdown.trValue} MC totali`
    );
  }

  // --- VP ---
  if (breakdown.vpValue !== 0) {
    if (card.effects.vp) {
      lines.push(
        `Punti Vittoria: ${card.effects.vp} VP x 13 MC/VP = ${card.effects.vp * 13} MC. Ogni VP vale circa 13 MC perche e il costo medio per ottenere 1 VP tramite progetti standard.`
      );
    }
    if (card.effects.vpPerResource) {
      lines.push(
        `VP variabili: 1 VP ogni ${card.effects.vpPerResource.per} ${card.effects.vpPerResource.resource} accumulati sulla carta. Stima conservativa: ~6 risorse = ${Math.floor(6 / card.effects.vpPerResource.per)} VP extra.`
      );
    }
    if (card.effects.vpPerTag) {
      lines.push(
        `VP variabili: 1 VP ogni ${card.effects.vpPerTag.per} tag ${card.effects.vpPerTag.tag}. Stima: ~4 tag = ${Math.floor(4 / card.effects.vpPerTag.per)} VP extra.`
      );
    }
  }

  // --- GLOBAL PARAMETERS ---
  if (breakdown.globalParameterValue !== 0) {
    const globalParts: string[] = [];
    if (card.effects.temperatureSteps && settings.temperatureAvailable) {
      globalParts.push(
        `+${card.effects.temperatureSteps} temp = +${card.effects.temperatureSteps} TR (${card.effects.temperatureSteps * (13 + settings.generationsRemaining)} MC)`
      );
    }
    if (card.effects.oxygenSteps && settings.oxygenAvailable) {
      globalParts.push(
        `+${card.effects.oxygenSteps} ossigeno = +${card.effects.oxygenSteps} TR (${card.effects.oxygenSteps * (13 + settings.generationsRemaining)} MC)`
      );
    }
    if (card.effects.oceanTiles && settings.oceansAvailable) {
      globalParts.push(
        `${card.effects.oceanTiles} oceano/i = +${card.effects.oceanTiles} TR + bonus piazzamento (~${card.effects.oceanTiles * 2} MC)`
      );
    }
    if (card.effects.greeneryTiles) {
      const gVal = card.effects.greeneryTiles * 13;
      const gTR = settings.oxygenAvailable ? card.effects.greeneryTiles * (13 + settings.generationsRemaining) : 0;
      globalParts.push(
        `${card.effects.greeneryTiles} foresta/e = ${card.effects.greeneryTiles} VP (${gVal} MC)${settings.oxygenAvailable ? ` + ${card.effects.greeneryTiles} TR da ossigeno (${gTR} MC)` : ""}`
      );
    }
    if (card.effects.cityTiles) {
      globalParts.push(
        `${card.effects.cityTiles} citta = ~2 VP da adiacenza (${card.effects.cityTiles * 26} MC)`
      );
    }
    lines.push(`Parametri globali: ${breakdown.globalParameterValue} MC`);
    for (const p of globalParts) {
      lines.push(`  ${p}`);
    }
  }

  // --- CARD DISCOUNT ---
  if (breakdown.cardDiscountValue !== 0 && card.effects.cardDiscount) {
    lines.push(
      `Sconto carte: -${card.effects.cardDiscount} MC per ogni carta giocata. Con ~2.5 carte/gen x ${settings.generationsRemaining} gen = ${breakdown.cardDiscountValue} MC risparmiati.`
    );
  }

  // --- TAGS ---
  if (breakdown.tagValue !== 0) {
    const tagList = card.tags.join(", ");
    lines.push(
      `Sinergia tag (${tagList}): ${card.tags.length} tag x 1 MC = ${breakdown.tagValue} MC. I tag aiutano a soddisfare requisiti e attivare effetti di altre carte.`
    );
  }

  // --- REQUIREMENT PENALTY ---
  if (breakdown.requirementPenalty !== 0 && card.requirements) {
    const req = card.requirements;
    const penaltyParts: string[] = [];
    if (req.minOceans !== undefined && req.minOceans > 0) {
      penaltyParts.push(`min ${req.minOceans} oceani (-${req.minOceans * 2} MC base)`);
    }
    if (req.minTemperature !== undefined) {
      const steps = (req.minTemperature - (-30)) / 2;
      if (steps > 0) {
        penaltyParts.push(`temp >= ${req.minTemperature}°C (-${(steps * 1.2).toFixed(1)} MC base)`);
      }
    }
    if (req.minOxygen !== undefined && req.minOxygen > 0) {
      penaltyParts.push(`O2 >= ${req.minOxygen}% (-${(req.minOxygen * 1.5).toFixed(1)} MC base)`);
    }
    if (req.maxTemperature !== undefined) {
      penaltyParts.push(`temp <= ${req.maxTemperature}°C (finestra limitata)`);
    }
    if (req.maxOxygen !== undefined) {
      penaltyParts.push(`O2 <= ${req.maxOxygen}% (finestra limitata)`);
    }
    if (req.maxOceans !== undefined) {
      penaltyParts.push(`oceani <= ${req.maxOceans} (finestra limitata)`);
    }
    if (req.tag) {
      penaltyParts.push(`richiede ${req.tag.count}x tag ${req.tag.tag} (-${req.tag.count * 3} MC)`);
    }
    if (req.minProduction) {
      for (const [res, amount] of Object.entries(req.minProduction)) {
        if (amount !== undefined && amount > 0) {
          const resName = resourceNames[res] || res;
          penaltyParts.push(`prod. ${resName} >= ${amount} (-${amount * 3} MC)`);
        }
      }
    }
    lines.push(`Penalita requisiti: -${breakdown.requirementPenalty} MC. Questa carta ha vincoli che ne limitano la giocabilita:`);
    for (const p of penaltyParts) {
      lines.push(`  ${p}`);
    }
    lines.push(`  La penalita e ${settings.generationsRemaining >= settings.totalGenerations * 0.6 ? "piena (inizio partita, piu incertezza)" : "ridotta (fine partita, sai gia se puoi giocarla)"}.`);
  }

  // --- BREAKEVEN ---
  if (breakevenGeneration !== null) {
    if (breakevenGeneration <= settings.generationsRemaining) {
      lines.push(
        `Pareggio: la produzione ripaga il costo in ${breakevenGeneration} generazion${breakevenGeneration === 1 ? "e" : "i"}. Con ${settings.generationsRemaining} gen rimanenti, hai ${settings.generationsRemaining - breakevenGeneration} gen di profitto puro.`
      );
    } else {
      lines.push(
        `Attenzione: servono ${breakevenGeneration} generazioni per il pareggio, ma ne rimangono solo ${settings.generationsRemaining}. Questa carta non si ripaga!`
      );
    }
  }

  // --- OVERALL VERDICT ---
  lines.push("");
  const netVal = valuation.netValue;
  if (netVal >= 20) {
    lines.push(`Verdetto: Carta eccezionale (S). Guadagno netto di ${netVal} MC. Giocala sempre se possibile.`);
  } else if (netVal >= 10) {
    lines.push(`Verdetto: Carta ottima (A). Guadagno netto di ${netVal} MC. Quasi sempre conviene giocarla.`);
  } else if (netVal >= 3) {
    lines.push(`Verdetto: Carta buona (B). Guadagno netto di ${netVal} MC. Conviene se si integra con la strategia.`);
  } else if (netVal >= -3) {
    lines.push(`Verdetto: Carta media (C). Valore netto ${netVal} MC. Giocala solo se hai sinergie specifiche.`);
  } else if (netVal >= -10) {
    lines.push(`Verdetto: Carta scarsa (D). Perdi ${Math.abs(netVal)} MC netti. Scartala a meno di sinergie fortissime.`);
  } else {
    lines.push(`Verdetto: Carta pessima (F). Perdi ${Math.abs(netVal)} MC netti. Non vale quasi mai la pena giocarla.`);
  }

  return lines;
}
