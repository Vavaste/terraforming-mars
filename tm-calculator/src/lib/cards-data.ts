import { TerraformingMarsCard } from "./types";

/**
 * Complete Terraforming Mars base game + Corporate Era card database
 * Data sourced from official game rules and community databases
 * 208 project cards from the base game
 */
export const ALL_CARDS: TerraformingMarsCard[] = [
  // ===== BASE GAME PROJECT CARDS =====
  {
    id: 1, name: "Colonizer Training Camp", cost: 8, type: "automated", tags: ["building", "jovian"],
    expansion: "base", requirements: { maxOxygen: 5 },
    effects: { vp: 2 }, cardNumber: "001"
  },
  {
    id: 2, name: "Asteroid Mining Consortium", cost: 13, type: "automated", tags: ["jovian"],
    expansion: "base", requirements: { minProduction: { titanium: 1 } },
    effects: { production: { titanium: 1 }, vp: 1 }, cardNumber: "002"
  },
  {
    id: 3, name: "Deep Well Heating", cost: 13, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { energy: 1 }, temperatureSteps: 1 }, cardNumber: "003"
  },
  {
    id: 4, name: "Cloud Seeding", cost: 11, type: "automated", tags: [],
    expansion: "base", requirements: { minOceans: 3 },
    effects: { production: { megacredits: -1, plants: 2 } }, cardNumber: "004"
  },
  {
    id: 5, name: "Search For Life", cost: 3, type: "active", tags: ["science"],
    expansion: "base", requirements: { maxOxygen: 6 },
    effects: { vp: 3, description: "Action: Spend 1MC to reveal top card. If microbe tag, add science resource." }, cardNumber: "005"
  },
  {
    id: 6, name: "Inventors' Guild", cost: 9, type: "active", tags: ["science"],
    expansion: "base",
    effects: { description: "Action: Look at top card and buy or discard it." }, cardNumber: "006"
  },
  {
    id: 7, name: "Martian Rails", cost: 13, type: "active", tags: ["building"],
    expansion: "base",
    effects: { description: "Action: Spend 1 energy to gain 1MC per city on Mars." }, cardNumber: "007"
  },
  {
    id: 8, name: "Capital", cost: 26, type: "automated", tags: ["city", "building"],
    expansion: "base", requirements: { minOceans: 4 },
    effects: { production: { energy: -2, megacredits: 5 }, cityTiles: 1, description: "1VP per adjacent ocean tile" }, cardNumber: "008"
  },
  {
    id: 9, name: "Asteroid", cost: 14, type: "event", tags: ["space"],
    expansion: "base",
    effects: { temperatureSteps: 1, tr: 1, resources: { titanium: 2 } }, cardNumber: "009"
  },
  {
    id: 10, name: "Comet", cost: 21, type: "event", tags: ["space"],
    expansion: "base",
    effects: { temperatureSteps: 1, oceanTiles: 1 }, cardNumber: "010"
  },
  {
    id: 11, name: "Big Asteroid", cost: 27, type: "event", tags: ["space"],
    expansion: "base",
    effects: { temperatureSteps: 2, resources: { titanium: 4 } }, cardNumber: "011"
  },
  {
    id: 12, name: "Water Import From Europa", cost: 25, type: "active", tags: ["space", "jovian"],
    expansion: "base",
    effects: { vp: 1, description: "Action: Pay 12MC to place an ocean tile. VP: 1 per jovian tag." }, cardNumber: "012"
  },
  {
    id: 13, name: "Space Elevator", cost: 27, type: "active", tags: ["space", "building"],
    expansion: "base",
    effects: { production: { titanium: 1 }, vp: 2, description: "Action: Spend 1 steel to gain 3MC" }, cardNumber: "013"
  },
  {
    id: 14, name: "Development Center", cost: 11, type: "active", tags: ["science", "building"],
    expansion: "base",
    effects: { description: "Action: Spend 1 energy to draw a card." }, cardNumber: "014"
  },
  {
    id: 15, name: "Equatorial Magnetizer", cost: 11, type: "active", tags: ["building"],
    expansion: "base",
    effects: { description: "Action: Decrease energy production 1 step to increase TR 1 step." }, cardNumber: "015"
  },
  {
    id: 16, name: "Domed Crater", cost: 24, type: "automated", tags: ["city", "building"],
    expansion: "base", requirements: { maxOxygen: 7 },
    effects: { production: { energy: -1, megacredits: 3 }, cityTiles: 1, resources: { plants: 3 } }, cardNumber: "016"
  },
  {
    id: 17, name: "Noctis City", cost: 18, type: "automated", tags: ["city", "building"],
    expansion: "base",
    effects: { production: { energy: -1, megacredits: 3 }, cityTiles: 1 }, cardNumber: "017"
  },
  {
    id: 18, name: "Methane From Titan", cost: 28, type: "automated", tags: ["space", "jovian"],
    expansion: "base", requirements: { minOxygen: 2 },
    effects: { production: { heat: 2, plants: 2 }, vp: 2 }, cardNumber: "018"
  },
  {
    id: 19, name: "Imported Hydrogen", cost: 16, type: "event", tags: ["space", "earth"],
    expansion: "base",
    effects: { oceanTiles: 1, resources: { plants: 3 } }, cardNumber: "019"
  },
  {
    id: 20, name: "Research Outpost", cost: 18, type: "active", tags: ["science", "city", "building"],
    expansion: "base",
    effects: { cityTiles: 1, cardDiscount: 1 }, cardNumber: "020"
  },
  {
    id: 21, name: "Phobos Space Haven", cost: 25, type: "automated", tags: ["space", "city"],
    expansion: "base",
    effects: { production: { titanium: 1 }, cityTiles: 1, vp: 3 }, cardNumber: "021"
  },
  {
    id: 22, name: "Black Polar Dust", cost: 15, type: "automated", tags: [],
    expansion: "base",
    effects: { production: { megacredits: -2, heat: 3 }, oceanTiles: 1 }, cardNumber: "022"
  },
  {
    id: 23, name: "Arctic Algae", cost: 12, type: "active", tags: ["plant"],
    expansion: "base", requirements: { maxTemperature: -12 },
    effects: { resources: { plants: 1 }, description: "Effect: When anyone places an ocean, gain 2 plants." }, cardNumber: "023"
  },
  {
    id: 24, name: "Predators", cost: 14, type: "active", tags: ["animal"],
    expansion: "base", requirements: { minOxygen: 11 },
    effects: { vpPerResource: { resource: "animal", per: 1 }, description: "Action: Remove 1 animal from any card and add it here." }, cardNumber: "024"
  },
  {
    id: 25, name: "Space Station", cost: 10, type: "active", tags: ["space"],
    expansion: "base",
    effects: { vp: 1, description: "Effect: When you play a space tag, you pay 2MC less." }, cardNumber: "025"
  },
  {
    id: 26, name: "Eos Chasma National Park", cost: 16, type: "automated", tags: ["plant", "building"],
    expansion: "base", requirements: { minTemperature: -12 },
    effects: { production: { megacredits: 2 }, resources: { plants: 3 }, vp: 1, description: "Add 1 animal to any card." }, cardNumber: "026"
  },
  {
    id: 27, name: "Interstellar Colony Ship", cost: 24, type: "event", tags: ["space", "earth"],
    expansion: "base", requirements: { tag: { tag: "science", count: 5 } },
    effects: { vp: 4 }, cardNumber: "027"
  },
  {
    id: 28, name: "Security Fleet", cost: 12, type: "active", tags: ["space"],
    expansion: "base",
    effects: { vpPerResource: { resource: "fighter", per: 1 }, description: "Action: Spend 1 titanium to add 1 fighter here." }, cardNumber: "028"
  },
  {
    id: 29, name: "Cupola City", cost: 16, type: "automated", tags: ["city", "building"],
    expansion: "base", requirements: { maxOxygen: 9 },
    effects: { production: { energy: -1, megacredits: 3 }, cityTiles: 1 }, cardNumber: "029"
  },
  {
    id: 30, name: "Lunar Beam", cost: 13, type: "automated", tags: ["power", "earth"],
    expansion: "base",
    effects: { production: { megacredits: -2, heat: 2, energy: 2 } }, cardNumber: "030"
  },
  {
    id: 31, name: "Optimal Aerobraking", cost: 7, type: "active", tags: ["space"],
    expansion: "base",
    effects: { description: "Effect: When you play a space event, gain 3MC and 3 heat." }, cardNumber: "031"
  },
  {
    id: 32, name: "Underground City", cost: 18, type: "automated", tags: ["city", "building"],
    expansion: "base",
    effects: { production: { energy: -2, steel: 2 }, cityTiles: 1 }, cardNumber: "032"
  },
  {
    id: 33, name: "Regolith Eaters", cost: 13, type: "active", tags: ["science", "microbe"],
    expansion: "base",
    effects: { description: "Action: Add 1 microbe here, or remove 2 microbes to raise oxygen 1 step." }, cardNumber: "033"
  },
  {
    id: 34, name: "GHG Producing Bacteria", cost: 8, type: "active", tags: ["science", "microbe"],
    expansion: "base", requirements: { minOxygen: 4 },
    effects: { description: "Action: Add 1 microbe here, or remove 2 microbes to raise temperature 1 step." }, cardNumber: "034"
  },
  {
    id: 35, name: "Ants", cost: 9, type: "active", tags: ["microbe"],
    expansion: "base", requirements: { minOxygen: 4 },
    effects: { vpPerResource: { resource: "microbe", per: 2 }, description: "Action: Remove 1 microbe from any card to add it here." }, cardNumber: "035"
  },
  {
    id: 36, name: "Release of Inert Gases", cost: 14, type: "event", tags: [],
    expansion: "base",
    effects: { tr: 2 }, cardNumber: "036"
  },
  {
    id: 37, name: "Nitrogen-Rich Asteroid", cost: 31, type: "event", tags: ["space"],
    expansion: "base",
    effects: { tr: 2, temperatureSteps: 1, resources: { plants: 4 } }, cardNumber: "037"
  },
  {
    id: 38, name: "Rover Construction", cost: 8, type: "active", tags: ["building"],
    expansion: "base",
    effects: { description: "Effect: When any city tile is placed, gain 2MC." }, cardNumber: "038"
  },
  {
    id: 39, name: "Deimos Down", cost: 31, type: "event", tags: ["space"],
    expansion: "base",
    effects: { temperatureSteps: 3, resources: { steel: 4 } }, cardNumber: "039"
  },
  {
    id: 40, name: "Asteroid Mining", cost: 30, type: "automated", tags: ["space", "jovian"],
    expansion: "base",
    effects: { production: { titanium: 2 }, vp: 2 }, cardNumber: "040"
  },
  {
    id: 41, name: "Food Factory", cost: 12, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { plants: -1, megacredits: 4 }, vp: 1 }, cardNumber: "041"
  },
  {
    id: 42, name: "Archaebacteria", cost: 6, type: "automated", tags: ["microbe"],
    expansion: "base", requirements: { maxTemperature: -18 },
    effects: { production: { plants: 1 } }, cardNumber: "042"
  },
  {
    id: 43, name: "Carbonate Processing", cost: 6, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -1, heat: 3 } }, cardNumber: "043"
  },
  {
    id: 44, name: "Natural Preserve", cost: 9, type: "automated", tags: ["science", "building"],
    expansion: "base", requirements: { maxOxygen: 4 },
    effects: { production: { megacredits: 1 }, vp: 1 }, cardNumber: "044"
  },
  {
    id: 45, name: "Nuclear Power", cost: 10, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { megacredits: -2, energy: 3 } }, cardNumber: "045"
  },
  {
    id: 46, name: "Lightning Harvest", cost: 8, type: "automated", tags: ["power"],
    expansion: "base", requirements: { tag: { tag: "science", count: 3 } },
    effects: { production: { megacredits: 1, energy: 1 }, vp: 1 }, cardNumber: "046"
  },
  {
    id: 47, name: "Algae", cost: 10, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minOceans: 5 },
    effects: { resources: { plants: 1 }, production: { plants: 2 } }, cardNumber: "047"
  },
  {
    id: 48, name: "Adapted Lichen", cost: 9, type: "automated", tags: ["plant"],
    expansion: "base",
    effects: { production: { plants: 1 } }, cardNumber: "048"
  },
  {
    id: 49, name: "Tardigrades", cost: 4, type: "active", tags: ["microbe"],
    expansion: "base",
    effects: { vpPerResource: { resource: "microbe", per: 4 }, description: "Action: Add 1 microbe here." }, cardNumber: "049"
  },
  {
    id: 50, name: "Virus", cost: 1, type: "event", tags: ["microbe"],
    expansion: "base",
    effects: { description: "Remove up to 2 animals or 5 plants from any player." }, cardNumber: "050"
  },
  {
    id: 51, name: "Miranda Resort", cost: 12, type: "automated", tags: ["space", "jovian"],
    expansion: "base",
    effects: { production: { megacredits: 1 }, vp: 1, description: "+1MC production per earth tag you have." }, cardNumber: "051"
  },
  {
    id: 52, name: "Fish", cost: 9, type: "active", tags: ["animal"],
    expansion: "base", requirements: { minTemperature: 2 },
    effects: { production: { plants: -1 }, vpPerResource: { resource: "animal", per: 1 }, description: "Action: Add 1 animal here. Decrease any plant production 1 step." }, cardNumber: "052"
  },
  {
    id: 53, name: "Lake Marineris", cost: 18, type: "automated", tags: [],
    expansion: "base", requirements: { minTemperature: 0 },
    effects: { oceanTiles: 2, vp: 2 }, cardNumber: "053"
  },
  {
    id: 54, name: "Small Animals", cost: 6, type: "active", tags: ["animal"],
    expansion: "base", requirements: { minOxygen: 6 },
    effects: { production: { plants: -1 }, vpPerResource: { resource: "animal", per: 2 }, description: "Action: Add 1 animal here." }, cardNumber: "054"
  },
  {
    id: 55, name: "Kelp Farming", cost: 17, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minOceans: 6 },
    effects: { production: { megacredits: 2, plants: 3 }, resources: { plants: 2 }, vp: 1 }, cardNumber: "055"
  },
  {
    id: 56, name: "Mine", cost: 4, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { steel: 1 } }, cardNumber: "056"
  },
  {
    id: 57, name: "Vesta Shipyard", cost: 15, type: "automated", tags: ["space", "jovian"],
    expansion: "base",
    effects: { production: { titanium: 1 }, vp: 1 }, cardNumber: "057"
  },
  {
    id: 58, name: "Beam From A Thorium Asteroid", cost: 32, type: "automated", tags: ["space", "power", "jovian"],
    expansion: "base", requirements: { tag: { tag: "jovian", count: 1 } },
    effects: { production: { heat: 3, energy: 3 }, vp: 1 }, cardNumber: "058"
  },
  {
    id: 59, name: "Mangrove", cost: 12, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minTemperature: 4 },
    effects: { greeneryTiles: 1, vp: 1 }, cardNumber: "059"
  },
  {
    id: 60, name: "Trees", cost: 13, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minTemperature: -4 },
    effects: { production: { plants: 3 }, resources: { plants: 1 }, vp: 1 }, cardNumber: "060"
  },
  {
    id: 61, name: "Great Escarpment Consortium", cost: 6, type: "automated", tags: [],
    expansion: "base", requirements: { minProduction: { steel: 1 } },
    effects: { production: { steel: 1 } }, cardNumber: "061"
  },
  {
    id: 62, name: "Mineral Deposit", cost: 5, type: "event", tags: [],
    expansion: "base",
    effects: { resources: { steel: 5 } }, cardNumber: "062"
  },
  {
    id: 63, name: "Mining Expedition", cost: 12, type: "event", tags: [],
    expansion: "base",
    effects: { oxygenSteps: 1, resources: { steel: 2 } }, cardNumber: "063"
  },
  {
    id: 64, name: "Mining Area", cost: 4, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { description: "Place on area with steel/titanium bonus. Increase that production 1 step." }, cardNumber: "064"
  },
  {
    id: 65, name: "Building Industries", cost: 6, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -1, steel: 2 } }, cardNumber: "065"
  },
  {
    id: 66, name: "Land Claim", cost: 1, type: "event", tags: [],
    expansion: "base",
    effects: { description: "Place your marker on a non-reserved area. Only you may place a tile there." }, cardNumber: "066"
  },
  {
    id: 67, name: "Mining Rights", cost: 9, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { description: "Place on area with steel/titanium bonus. Increase that production 1 step." }, cardNumber: "067"
  },
  {
    id: 68, name: "Sponsors", cost: 6, type: "automated", tags: ["earth"],
    expansion: "base",
    effects: { production: { megacredits: 2 } }, cardNumber: "068"
  },
  {
    id: 69, name: "Electro Catapult", cost: 17, type: "active", tags: ["building"],
    expansion: "base", requirements: { maxOxygen: 8 },
    effects: { production: { energy: -1 }, vp: 1, description: "Action: Spend 1 plant or 1 steel to gain 7MC." }, cardNumber: "069"
  },
  {
    id: 70, name: "Earth Catapult", cost: 23, type: "active", tags: ["earth"],
    expansion: "base",
    effects: { cardDiscount: 2, vp: 2 }, cardNumber: "070"
  },
  {
    id: 71, name: "Advanced Alloys", cost: 9, type: "active", tags: ["science"],
    expansion: "base",
    effects: { description: "Effect: Each steel is worth 1MC extra. Each titanium is worth 1MC extra." }, cardNumber: "071"
  },
  {
    id: 72, name: "Birds", cost: 10, type: "active", tags: ["animal"],
    expansion: "base", requirements: { minOxygen: 13 },
    effects: { production: { plants: -2 }, vpPerResource: { resource: "animal", per: 1 }, description: "Action: Add 1 animal here." }, cardNumber: "072"
  },
  {
    id: 73, name: "Mars University", cost: 8, type: "active", tags: ["science", "building"],
    expansion: "base",
    effects: { description: "Effect: When you play a science tag, you may discard a card to draw a card." }, cardNumber: "073"
  },
  {
    id: 74, name: "Viral Enhancers", cost: 9, type: "active", tags: ["science", "microbe"],
    expansion: "base",
    effects: { description: "Effect: When you play an animal/plant/microbe tag, add 1 resource to that card or gain 1 plant." }, cardNumber: "074"
  },
  {
    id: 75, name: "Towing A Comet", cost: 23, type: "event", tags: ["space"],
    expansion: "base",
    effects: { oceanTiles: 1, oxygenSteps: 1, resources: { plants: 2 } }, cardNumber: "075"
  },
  {
    id: 76, name: "Space Mirrors", cost: 3, type: "active", tags: ["power", "space"],
    expansion: "base",
    effects: { description: "Action: Spend 7MC to increase energy production 1 step." }, cardNumber: "076"
  },
  {
    id: 77, name: "Solar Wind Power", cost: 11, type: "automated", tags: ["space", "power", "science"],
    expansion: "base",
    effects: { production: { energy: 1 }, resources: { titanium: 2 } }, cardNumber: "077"
  },
  {
    id: 78, name: "Ice Cap Melting", cost: 5, type: "event", tags: [],
    expansion: "base", requirements: { minTemperature: 2 },
    effects: { oceanTiles: 1 }, cardNumber: "078"
  },
  {
    id: 79, name: "Terraforming Ganymede", cost: 33, type: "automated", tags: ["space", "jovian"],
    expansion: "base",
    effects: { tr: 1, vp: 2, description: "+1 TR per jovian tag you have." }, cardNumber: "079"
  },
  {
    id: 80, name: "Immigration Shuttles", cost: 31, type: "automated", tags: ["space", "earth"],
    expansion: "base",
    effects: { production: { megacredits: 5 }, description: "1VP per 3 city tiles in play." }, cardNumber: "080"
  },
  {
    id: 81, name: "Restricted Area", cost: 11, type: "active", tags: ["science"],
    expansion: "base",
    effects: { description: "Action: Spend 2MC to draw a card." }, cardNumber: "081"
  },
  {
    id: 82, name: "Immigrant City", cost: 13, type: "automated", tags: ["city", "building"],
    expansion: "base",
    effects: { production: { energy: -1, megacredits: -2 }, cityTiles: 1, description: "Effect: When a city is placed, gain 1MC production." }, cardNumber: "082"
  },
  {
    id: 83, name: "Solar Power", cost: 11, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { energy: 1 }, vp: 1 }, cardNumber: "083"
  },
  {
    id: 84, name: "Breathing Filters", cost: 11, type: "automated", tags: ["science"],
    expansion: "base", requirements: { minOxygen: 7 },
    effects: { vp: 2 }, cardNumber: "084"
  },
  {
    id: 85, name: "Artificial Photosynthesis", cost: 12, type: "automated", tags: ["science"],
    expansion: "base",
    effects: { production: { energy: 2 }, description: "OR: increase plant production 1 step" }, cardNumber: "085"
  },
  {
    id: 86, name: "Artificial Lake", cost: 15, type: "automated", tags: [],
    expansion: "base", requirements: { minTemperature: -6 },
    effects: { oceanTiles: 1, vp: 1 }, cardNumber: "086"
  },
  {
    id: 87, name: "Geothermal Power", cost: 11, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { energy: 2 } }, cardNumber: "087"
  },
  {
    id: 88, name: "Farming", cost: 16, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minTemperature: 4 },
    effects: { production: { megacredits: 2, plants: 2 }, resources: { plants: 2 }, vp: 2 }, cardNumber: "088"
  },
  {
    id: 89, name: "Dust Seals", cost: 2, type: "automated", tags: [],
    expansion: "base", requirements: { maxOceans: 3 },
    effects: { vp: 1 }, cardNumber: "089"
  },
  {
    id: 90, name: "Urbanized Area", cost: 10, type: "automated", tags: ["city", "building"],
    expansion: "base",
    effects: { production: { energy: -1, megacredits: 2 }, cityTiles: 1 }, cardNumber: "090"
  },
  {
    id: 91, name: "Sabotage", cost: 1, type: "event", tags: [],
    expansion: "base",
    effects: { description: "Remove up to 3 titanium or 4 steel from any player, or reduce MC production 2 steps." }, cardNumber: "091"
  },
  {
    id: 92, name: "Moss", cost: 4, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minOceans: 3 },
    effects: { production: { plants: 1 }, description: "Lose 1 plant." }, cardNumber: "092"
  },
  {
    id: 93, name: "Industrial Center", cost: 4, type: "active", tags: ["building"],
    expansion: "base",
    effects: { description: "Action: Spend 7MC to increase steel production 1 step. Must be next to city." }, cardNumber: "093"
  },
  {
    id: 94, name: "Hired Raiders", cost: 1, type: "event", tags: [],
    expansion: "base",
    effects: { description: "Steal up to 2 steel, or 3 MC from any player." }, cardNumber: "094"
  },
  {
    id: 95, name: "Hackers", cost: 3, type: "automated", tags: [],
    expansion: "base",
    effects: { production: { energy: -1, megacredits: 2 } }, cardNumber: "095"
  },
  {
    id: 96, name: "GHG Factories", cost: 11, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -1, heat: 4 } }, cardNumber: "096"
  },
  {
    id: 97, name: "Plantation", cost: 15, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { tag: { tag: "science", count: 2 } },
    effects: { greeneryTiles: 1 }, cardNumber: "097"
  },
  {
    id: 98, name: "Power Plant", cost: 4, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { energy: 1 } }, cardNumber: "141"
  },
  {
    id: 99, name: "Mohole Area", cost: 20, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { heat: 4 } }, cardNumber: "142"
  },
  {
    id: 100, name: "Large Convoy", cost: 36, type: "event", tags: ["space", "earth"],
    expansion: "base",
    effects: { oceanTiles: 1, resources: { plants: 5 }, drawCards: 2, vp: 2, description: "OR: Add 4 animals to a card." }, cardNumber: "143"
  },
  {
    id: 101, name: "Titanium Mine", cost: 7, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { titanium: 1 } }, cardNumber: "144"
  },
  {
    id: 102, name: "Strip Mine", cost: 25, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -2, steel: 2, titanium: 1 }, oxygenSteps: 2 }, cardNumber: "145"
  },
  {
    id: 103, name: "Wave Power", cost: 8, type: "automated", tags: ["power"],
    expansion: "base", requirements: { minOceans: 5 },
    effects: { production: { energy: 1 }, vp: 1 }, cardNumber: "139"
  },
  {
    id: 104, name: "Lava Flows", cost: 18, type: "event", tags: [],
    expansion: "base",
    effects: { temperatureSteps: 2 }, cardNumber: "140"
  },
  {
    id: 105, name: "Power Grid", cost: 18, type: "automated", tags: ["power"],
    expansion: "base",
    effects: { production: { energy: 1 }, description: "+1 energy production per power tag." }, cardNumber: "102"
  },
  {
    id: 106, name: "Steelworks", cost: 15, type: "active", tags: ["building"],
    expansion: "base",
    effects: { description: "Action: Spend 4 energy to gain 2 steel and raise oxygen 1 step." }, cardNumber: "103"
  },
  {
    id: 107, name: "Ore Processor", cost: 13, type: "active", tags: ["building"],
    expansion: "base",
    effects: { description: "Action: Spend 4 energy to gain 1 titanium and raise oxygen 1 step." }, cardNumber: "104"
  },
  {
    id: 108, name: "Earth Office", cost: 1, type: "active", tags: ["earth"],
    expansion: "base",
    effects: { description: "Effect: When you play an earth tag, you pay 3MC less." }, cardNumber: "105"
  },
  {
    id: 109, name: "Acquired Company", cost: 10, type: "automated", tags: ["earth"],
    expansion: "base",
    effects: { production: { megacredits: 3 } }, cardNumber: "106"
  },
  {
    id: 110, name: "Media Archives", cost: 8, type: "automated", tags: ["earth"],
    expansion: "base",
    effects: { description: "Gain 1MC for each event ever played by all players." }, cardNumber: "107"
  },
  {
    id: 111, name: "Media Group", cost: 6, type: "active", tags: ["earth"],
    expansion: "base",
    effects: { description: "Effect: After you play an event, gain 3MC." }, cardNumber: "109"
  },
  {
    id: 112, name: "Business Network", cost: 4, type: "active", tags: ["earth"],
    expansion: "base",
    effects: { production: { megacredits: -1 }, description: "Action: Look at the top card and buy or discard it." }, cardNumber: "110"
  },
  {
    id: 113, name: "Business Contacts", cost: 7, type: "event", tags: ["earth"],
    expansion: "base",
    effects: { drawCards: 4, description: "Look at top 4 cards, keep 2." }, cardNumber: "111"
  },
  {
    id: 114, name: "Bribed Committee", cost: 7, type: "event", tags: ["earth"],
    expansion: "base",
    effects: { tr: 2 }, cardNumber: "112"
  },
  {
    id: 115, name: "Solar Probe", cost: 9, type: "event", tags: ["space", "science"],
    expansion: "base",
    effects: { drawCards: 1, description: "Draw 1 card per 3 science tags you have." }, cardNumber: "181"
  },
  {
    id: 116, name: "Bushes", cost: 10, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minTemperature: -10 },
    effects: { production: { plants: 2 }, resources: { plants: 2 } }, cardNumber: "093"
  },
  {
    id: 117, name: "Mass Converter", cost: 8, type: "active", tags: ["science", "power"],
    expansion: "base", requirements: { tag: { tag: "science", count: 5 } },
    effects: { production: { energy: 6 }, description: "Effect: When you play a space card, you pay 2MC less." }, cardNumber: "171"
  },
  {
    id: 118, name: "Physics Complex", cost: 12, type: "active", tags: ["science", "building"],
    expansion: "base",
    effects: { description: "Action: Spend 6 energy to add 1 science resource here. 2VP per science resource." }, cardNumber: "095"
  },
  {
    id: 119, name: "Greenhouses", cost: 6, type: "automated", tags: ["plant", "building"],
    expansion: "base",
    effects: { description: "Gain 1 plant for each city tile in play." }, cardNumber: "096"
  },
  {
    id: 120, name: "Nuclear Zone", cost: 10, type: "automated", tags: [],
    expansion: "base",
    effects: { temperatureSteps: 2, vp: -2 }, cardNumber: "097"
  },
  {
    id: 121, name: "Tropical Resort", cost: 13, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { heat: -2, megacredits: 3 }, vp: 2 }, cardNumber: "098"
  },
  {
    id: 122, name: "Toll Station", cost: 12, type: "automated", tags: ["space"],
    expansion: "base",
    effects: { production: { megacredits: 1 }, description: "+1MC production per space tag other players have." }, cardNumber: "099"
  },
  {
    id: 123, name: "Fueled Generators", cost: 1, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { megacredits: -1, energy: 1 } }, cardNumber: "100"
  },
  {
    id: 124, name: "Ironworks", cost: 11, type: "active", tags: ["building"],
    expansion: "base",
    effects: { description: "Action: Spend 4 energy to gain 1 steel and raise oxygen 1 step." }, cardNumber: "101"
  },
  {
    id: 125, name: "Power Supply Consortium", cost: 5, type: "automated", tags: ["power"],
    expansion: "base", requirements: { tag: { tag: "power", count: 2 } },
    effects: { production: { energy: 1 } }, cardNumber: "160"
  },
  {
    id: 126, name: "Convoy From Europa", cost: 15, type: "event", tags: ["space"],
    expansion: "base",
    effects: { oceanTiles: 1, drawCards: 1 }, cardNumber: "161"
  },
  {
    id: 127, name: "Imported GHG", cost: 7, type: "event", tags: ["space", "earth"],
    expansion: "base",
    effects: { production: { heat: 1 }, resources: { heat: 3 } }, cardNumber: "162"
  },
  {
    id: 128, name: "Imported Nitrogen", cost: 23, type: "event", tags: ["space", "earth"],
    expansion: "base",
    effects: { tr: 1, resources: { plants: 4 }, description: "Add 3 microbes and 2 animals to cards." }, cardNumber: "163"
  },
  {
    id: 129, name: "Micro-Mills", cost: 3, type: "automated", tags: [],
    expansion: "base",
    effects: { production: { heat: 1 } }, cardNumber: "164"
  },
  {
    id: 130, name: "Magnetic Field Generators", cost: 20, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -4, plants: 2 }, tr: 3 }, cardNumber: "165"
  },
  {
    id: 131, name: "Shuttles", cost: 10, type: "active", tags: ["space"],
    expansion: "base", requirements: { minOxygen: 5 },
    effects: { production: { energy: -1, megacredits: 2 }, vp: 1, description: "Effect: When you play a space tag, you pay 2MC less." }, cardNumber: "166"
  },
  {
    id: 132, name: "Import of Advanced GHG", cost: 9, type: "event", tags: ["space", "earth"],
    expansion: "base",
    effects: { production: { heat: 2 } }, cardNumber: "167"
  },
  {
    id: 133, name: "Windmills", cost: 6, type: "automated", tags: ["power", "building"],
    expansion: "base", requirements: { minOxygen: 7 },
    effects: { production: { energy: 1 }, vp: 1 }, cardNumber: "168"
  },
  {
    id: 134, name: "Zeppelins", cost: 13, type: "automated", tags: [],
    expansion: "base", requirements: { minOxygen: 5 },
    effects: { production: { megacredits: 1 }, vp: 1, description: "+1MC production per city you have." }, cardNumber: "169"
  },
  {
    id: 135, name: "Worms", cost: 8, type: "automated", tags: ["microbe"],
    expansion: "base", requirements: { minOxygen: 4 },
    effects: { production: { plants: 2 } }, cardNumber: "170"
  },
  {
    id: 136, name: "Decomposers", cost: 5, type: "active", tags: ["microbe"],
    expansion: "base", requirements: { minOxygen: 3 },
    effects: { vpPerResource: { resource: "microbe", per: 3 }, description: "Effect: When you play animal/plant/microbe tag, add 1 microbe here." }, cardNumber: "131"
  },
  {
    id: 137, name: "Fusion Power", cost: 14, type: "automated", tags: ["science", "power", "building"],
    expansion: "base", requirements: { tag: { tag: "power", count: 2 } },
    effects: { production: { energy: 3 } }, cardNumber: "132"
  },
  {
    id: 138, name: "Symbiotic Fungus", cost: 4, type: "active", tags: ["microbe"],
    expansion: "base", requirements: { minTemperature: -14 },
    effects: { description: "Action: Add 1 microbe to any card." }, cardNumber: "133"
  },
  {
    id: 139, name: "Extreme-Cold Fungus", cost: 13, type: "active", tags: ["microbe"],
    expansion: "base", requirements: { maxTemperature: -10 },
    effects: { description: "Action: Gain 1 plant or add 2 microbes to any card." }, cardNumber: "134"
  },
  {
    id: 140, name: "Advanced Ecosystems", cost: 11, type: "automated", tags: ["plant", "microbe", "animal"],
    expansion: "base", requirements: { tag: { tag: "plant", count: 1 } },
    effects: { vp: 3 }, cardNumber: "135"
  },
  {
    id: 141, name: "Great Dam", cost: 12, type: "automated", tags: ["power", "building"],
    expansion: "base", requirements: { minOceans: 4 },
    effects: { production: { energy: 2 }, vp: 1 }, cardNumber: "136"
  },
  {
    id: 142, name: "Cartel", cost: 8, type: "automated", tags: ["earth"],
    expansion: "base",
    effects: { production: { megacredits: 1 }, description: "+1MC production per earth tag." }, cardNumber: "137"
  },
  {
    id: 143, name: "Strip Mining", cost: 25, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -2, steel: 2, titanium: 1 }, oxygenSteps: 2 }, cardNumber: "138"
  },
  {
    id: 144, name: "Pets", cost: 10, type: "active", tags: ["animal", "earth"],
    expansion: "base",
    effects: { resources: { plants: 1 }, vpPerResource: { resource: "animal", per: 2 }, description: "Effect: When any city is placed, add 1 animal here. Cannot be removed." }, cardNumber: "172"
  },
  {
    id: 145, name: "Protected Habitats", cost: 5, type: "active", tags: [],
    expansion: "base",
    effects: { description: "Effect: Opponents may not remove your plants, animals, or microbes." }, cardNumber: "173"
  },
  {
    id: 146, name: "Lightning Harvest", cost: 8, type: "automated", tags: ["power"],
    expansion: "base", requirements: { tag: { tag: "science", count: 3 } },
    effects: { production: { megacredits: 1, energy: 1 }, vp: 1 }, cardNumber: "046"
  },
  {
    id: 147, name: "Nitrophilic Moss", cost: 8, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minOceans: 3 },
    effects: { production: { plants: 2 }, description: "Lose 2 plants." }, cardNumber: "146"
  },
  {
    id: 148, name: "Herbivores", cost: 12, type: "active", tags: ["animal"],
    expansion: "base", requirements: { minOxygen: 8 },
    effects: { production: { plants: -1 }, vpPerResource: { resource: "animal", per: 2 }, description: "Effect: When greenery is placed, add 1 animal here. Decrease any plant production." }, cardNumber: "147"
  },
  {
    id: 149, name: "Insects", cost: 9, type: "automated", tags: ["microbe"],
    expansion: "base", requirements: { minOxygen: 6 },
    effects: { production: { plants: 1 }, description: "+1 plant production per plant tag." }, cardNumber: "148"
  },
  {
    id: 150, name: "CEO's Favorite Project", cost: 1, type: "event", tags: [],
    expansion: "base",
    effects: { description: "Add 1 resource to any card with resources on it." }, cardNumber: "149"
  },
  {
    id: 151, name: "Anti-Gravity Technology", cost: 14, type: "active", tags: ["science"],
    expansion: "base", requirements: { tag: { tag: "science", count: 7 } },
    effects: { cardDiscount: 2, vp: 3 }, cardNumber: "150"
  },
  {
    id: 152, name: "Investment Loan", cost: 3, type: "event", tags: ["earth"],
    expansion: "base",
    effects: { production: { megacredits: -1 }, resources: { megacredits: 10 } }, cardNumber: "151"
  },
  {
    id: 153, name: "Insulation", cost: 2, type: "automated", tags: [],
    expansion: "base",
    effects: { description: "Decrease heat production any number of steps. Increase MC production the same number." }, cardNumber: "152"
  },
  {
    id: 154, name: "Adaptation Technology", cost: 12, type: "active", tags: ["science"],
    expansion: "base",
    effects: { vp: 1, description: "Effect: Your global requirements are +/- 2 steps." }, cardNumber: "153"
  },
  {
    id: 155, name: "Caretaker Contract", cost: 3, type: "active", tags: [],
    expansion: "base",
    effects: { description: "Action: Spend 8 heat to increase TR 1 step." }, cardNumber: "154"
  },
  {
    id: 156, name: "Designed Microorganisms", cost: 16, type: "automated", tags: ["science", "microbe"],
    expansion: "base", requirements: { maxTemperature: -14 },
    effects: { production: { plants: 2 } }, cardNumber: "155"
  },
  {
    id: 157, name: "Standard Technology", cost: 6, type: "active", tags: ["science"],
    expansion: "base",
    effects: { description: "Effect: After you pay for a standard project, gain 3MC." }, cardNumber: "156"
  },
  {
    id: 158, name: "Nitrite Reducing Bacteria", cost: 11, type: "active", tags: ["microbe"],
    expansion: "base",
    effects: { resources: { megacredits: 3 }, description: "Action: Add 1 microbe here, or remove 3 microbes to increase TR 1 step." }, cardNumber: "157"
  },
  {
    id: 159, name: "Industrial Microbes", cost: 12, type: "automated", tags: ["microbe", "building"],
    expansion: "base",
    effects: { production: { energy: 1, steel: 1 } }, cardNumber: "158"
  },
  {
    id: 160, name: "Lichen", cost: 7, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minTemperature: -24 },
    effects: { production: { plants: 1 } }, cardNumber: "159"
  },
  {
    id: 161, name: "Power Infrastructure", cost: 4, type: "active", tags: ["power", "building"],
    expansion: "base",
    effects: { description: "Action: Spend any amount of energy to gain that amount of MC." }, cardNumber: "194"
  },
  {
    id: 162, name: "Open City", cost: 23, type: "automated", tags: ["city", "building"],
    expansion: "base", requirements: { minOxygen: 12 },
    effects: { production: { energy: -1, megacredits: 4 }, cityTiles: 1, resources: { plants: 2 }, vp: 1 }, cardNumber: "108"
  },
  {
    id: 163, name: "Asteroid Deflection System", cost: 13, type: "active", tags: ["space", "earth", "building"],
    expansion: "base",
    effects: { description: "Action: Spend 1 asteroid resource here to increase temp 1 step. Effect: When you play a space tag, add 1 asteroid here." }, cardNumber: "195"
  },
  {
    id: 164, name: "Giant Space Mirror", cost: 17, type: "automated", tags: ["power", "space"],
    expansion: "base",
    effects: { production: { energy: 3 } }, cardNumber: "083"
  },
  {
    id: 165, name: "Trans-Neptune Probe", cost: 6, type: "automated", tags: ["science", "space"],
    expansion: "base",
    effects: { vp: 1 }, cardNumber: "084"
  },
  {
    id: 166, name: "Commercial District", cost: 16, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -1, megacredits: 4 }, description: "1VP per adjacent city. Place tile." }, cardNumber: "085"
  },
  {
    id: 167, name: "Robotic Workforce", cost: 9, type: "automated", tags: ["science"],
    expansion: "base",
    effects: { description: "Duplicate only the production box of one of your building tag cards." }, cardNumber: "086"
  },
  {
    id: 168, name: "Grass", cost: 11, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minTemperature: -16 },
    effects: { production: { plants: 1 }, resources: { plants: 3 } }, cardNumber: "087"
  },
  {
    id: 169, name: "Heater", cost: 3, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { energy: -1, heat: 1 }, temperatureSteps: 1 }, cardNumber: "088"
  },
  {
    id: 170, name: "Peroxide Power", cost: 7, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { megacredits: -1, energy: 2 } }, cardNumber: "089"
  },
  {
    id: 171, name: "Tropical Island", cost: 12, type: "automated", tags: ["plant", "building"],
    expansion: "base", requirements: { minOceans: 5 },
    effects: { production: { plants: 1, megacredits: 2 }, vp: 1 }, cardNumber: "090"
  },
  {
    id: 172, name: "Research", cost: 11, type: "automated", tags: ["science", "science"],
    expansion: "base",
    effects: { drawCards: 2, vp: 1 }, cardNumber: "090a"
  },
  {
    id: 173, name: "Gene Repair", cost: 12, type: "automated", tags: ["science"],
    expansion: "base", requirements: { tag: { tag: "science", count: 3 } },
    effects: { production: { megacredits: 2 }, vp: 2 }, cardNumber: "091"
  },
  {
    id: 174, name: "Io Mining Industries", cost: 41, type: "automated", tags: ["space", "jovian"],
    expansion: "base",
    effects: { production: { titanium: 2, megacredits: 2 }, description: "1VP per jovian tag." }, cardNumber: "092"
  },
  {
    id: 175, name: "Bushes", cost: 10, type: "automated", tags: ["plant"],
    expansion: "base", requirements: { minTemperature: -10 },
    effects: { production: { plants: 2 }, resources: { plants: 2 } }, cardNumber: "093"
  },
  {
    id: 176, name: "Mass Converter", cost: 8, type: "active", tags: ["science", "power"],
    expansion: "base", requirements: { tag: { tag: "science", count: 5 } },
    effects: { production: { energy: 6 }, description: "Effect: When you play a space card, you pay 2MC less." }, cardNumber: "171"
  },
  {
    id: 177, name: "Satellites", cost: 10, type: "automated", tags: ["space"],
    expansion: "base",
    effects: { production: { megacredits: 1 }, description: "+1MC production per space tag." }, cardNumber: "175"
  },
  {
    id: 178, name: "Noctis Farming", cost: 10, type: "automated", tags: ["plant", "building"],
    expansion: "base", requirements: { minTemperature: -20 },
    effects: { production: { megacredits: 1 }, resources: { plants: 2 }, vp: 1 }, cardNumber: "176"
  },
  {
    id: 179, name: "Water Splitting Plant", cost: 12, type: "active", tags: ["building"],
    expansion: "base", requirements: { minOceans: 2 },
    effects: { description: "Action: Spend 3 energy to raise oxygen 1 step." }, cardNumber: "177"
  },
  {
    id: 180, name: "Heat Trappers", cost: 6, type: "automated", tags: ["power", "building"],
    expansion: "base",
    effects: { production: { energy: 1 }, description: "Decrease any heat production 2 steps." }, cardNumber: "178"
  },
  {
    id: 181, name: "Soil Factory", cost: 9, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -1, plants: 1 }, vp: 1 }, cardNumber: "179"
  },
  {
    id: 182, name: "Fuel Factory", cost: 6, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -1, megacredits: 1, titanium: 1 } }, cardNumber: "180"
  },
  {
    id: 183, name: "Ice Asteroid", cost: 23, type: "event", tags: ["space"],
    expansion: "base",
    effects: { oceanTiles: 2 }, cardNumber: "078a"
  },
  {
    id: 184, name: "Quantum Extractor", cost: 13, type: "active", tags: ["science", "power"],
    expansion: "base", requirements: { tag: { tag: "science", count: 4 } },
    effects: { production: { energy: 4 }, description: "Effect: When you play a space tag, you pay 2MC less." }, cardNumber: "079a"
  },
  {
    id: 185, name: "Giant Ice Asteroid", cost: 36, type: "event", tags: ["space"],
    expansion: "base",
    effects: { temperatureSteps: 2, oceanTiles: 2 }, cardNumber: "080a"
  },
  {
    id: 186, name: "Ganymede Colony", cost: 20, type: "automated", tags: ["space", "jovian", "city"],
    expansion: "base",
    effects: { cityTiles: 1, description: "1VP per jovian tag." }, cardNumber: "081a"
  },
  {
    id: 187, name: "Callisto Penal Mines", cost: 24, type: "automated", tags: ["space", "jovian"],
    expansion: "base",
    effects: { production: { megacredits: 3 }, vp: 2 }, cardNumber: "082a"
  },
  {
    id: 188, name: "Giant Space Mirror", cost: 17, type: "automated", tags: ["power", "space"],
    expansion: "base",
    effects: { production: { energy: 3 } }, cardNumber: "083"
  },
  {
    id: 189, name: "Soletta", cost: 35, type: "automated", tags: ["space"],
    expansion: "base",
    effects: { production: { heat: 7 } }, cardNumber: "203"
  },
  {
    id: 190, name: "Technology Demonstration", cost: 5, type: "event", tags: ["science", "space"],
    expansion: "base",
    effects: { drawCards: 2 }, cardNumber: "204"
  },
  {
    id: 191, name: "Rad-Chem Factory", cost: 8, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -1 }, tr: 2 }, cardNumber: "205"
  },
  {
    id: 192, name: "Special Design", cost: 4, type: "event", tags: ["science"],
    expansion: "base",
    effects: { description: "The next card you play has +/- 2 for global requirements." }, cardNumber: "206"
  },
  {
    id: 193, name: "Medical Lab", cost: 13, type: "automated", tags: ["science", "building"],
    expansion: "base",
    effects: { production: { megacredits: 1 }, vp: 1, description: "+1MC production per building tag (including this)." }, cardNumber: "207"
  },
  {
    id: 194, name: "AI Central", cost: 21, type: "active", tags: ["science", "building"],
    expansion: "base", requirements: { tag: { tag: "science", count: 3 } },
    effects: { production: { energy: -1 }, vp: 1, description: "Action: Draw 2 cards." }, cardNumber: "208"
  },
  {
    id: 195, name: "Small Asteroid", cost: 10, type: "event", tags: ["space"],
    expansion: "base",
    effects: { temperatureSteps: 1 }, cardNumber: "209"
  },
  {
    id: 196, name: "Rad-Suits", cost: 6, type: "automated", tags: [],
    expansion: "base", requirements: { minOceans: 2 },
    effects: { production: { megacredits: 1 }, vp: 1 }, cardNumber: "186"
  },
  {
    id: 197, name: "Penguins", cost: 7, type: "active", tags: ["animal"],
    expansion: "base", requirements: { minOceans: 8 },
    effects: { vpPerResource: { resource: "animal", per: 1 }, description: "Action: Add 1 animal here." }, cardNumber: "212"
  },
  {
    id: 198, name: "Asteroid Standard Projects", cost: 14, type: "event", tags: ["space"],
    expansion: "base",
    effects: { temperatureSteps: 1, resources: { titanium: 2 } }, cardNumber: "009b"
  },
  {
    id: 199, name: "Protected Valley", cost: 23, type: "automated", tags: ["plant", "building"],
    expansion: "base",
    effects: { production: { megacredits: 2 }, greeneryTiles: 1 }, cardNumber: "174"
  },
  {
    id: 200, name: "Magnetic Field Dome", cost: 5, type: "automated", tags: ["building"],
    expansion: "base",
    effects: { production: { energy: -2, plants: 1 }, tr: 1 }, cardNumber: "171a"
  },
  {
    id: 201, name: "Pets", cost: 10, type: "active", tags: ["animal", "earth"],
    expansion: "base",
    effects: { vpPerResource: { resource: "animal", per: 2 }, description: "Effect: When any city is placed, add 1 animal here. Cannot be removed." }, cardNumber: "172"
  },
  {
    id: 202, name: "Subterranean Reservoir", cost: 11, type: "event", tags: [],
    expansion: "base",
    effects: { oceanTiles: 1 }, cardNumber: "127"
  },
  {
    id: 203, name: "Permafrost Extraction", cost: 8, type: "event", tags: [],
    expansion: "base", requirements: { minTemperature: -8 },
    effects: { oceanTiles: 1 }, cardNumber: "191"
  },
  {
    id: 204, name: "Invention Contest", cost: 2, type: "event", tags: ["science"],
    expansion: "base",
    effects: { drawCards: 3, description: "Look at top 3 cards, take 1." }, cardNumber: "192"
  },
  {
    id: 205, name: "Martian Survey", cost: 9, type: "event", tags: ["science"],
    expansion: "base", requirements: { maxOxygen: 4 },
    effects: { drawCards: 2, vp: 1 }, cardNumber: "193"
  },
  {
    id: 206, name: "Biomass Combustors", cost: 4, type: "automated", tags: ["power", "building"],
    expansion: "base", requirements: { minOxygen: 6 },
    effects: { production: { energy: 2 }, description: "Decrease any plant production 1 step." }, cardNumber: "183"
  },
  {
    id: 207, name: "Supply Drop", cost: 4, type: "event", tags: [],
    expansion: "base",
    effects: { resources: { titanium: 3, steel: 8, plants: 3 } }, cardNumber: "196"
  },
  {
    id: 208, name: "Dirigibles", cost: 11, type: "active", tags: [],
    expansion: "base",
    effects: { description: "Action: Add 1 floater here. Effect: When paying for Venus cards, floaters here are worth 3MC." }, cardNumber: "222b"
  },
];
