import Database from "better-sqlite3";
import path from "path";
import { TerraformingMarsCard, CardType, Tag, Expansion } from "./types";
import { ALL_CARDS } from "./cards-data";

const DB_PATH = path.join(process.cwd(), "terraforming-mars.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initializeDb(db);
  }
  return db;
}

function initializeDb(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      cost INTEGER NOT NULL,
      type TEXT NOT NULL,
      tags TEXT NOT NULL,
      expansion TEXT NOT NULL,
      requirements TEXT,
      effects TEXT NOT NULL,
      card_number TEXT NOT NULL
    );
  `);

  // Check if cards already exist
  const count = database.prepare("SELECT COUNT(*) as count FROM cards").get() as { count: number };
  if (count.count === 0) {
    const insert = database.prepare(`
      INSERT INTO cards (id, name, cost, type, tags, expansion, requirements, effects, card_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = database.transaction((cards: TerraformingMarsCard[]) => {
      for (const card of cards) {
        insert.run(
          card.id,
          card.name,
          card.cost,
          card.type,
          JSON.stringify(card.tags),
          card.expansion,
          card.requirements ? JSON.stringify(card.requirements) : null,
          JSON.stringify(card.effects),
          card.cardNumber
        );
      }
    });

    insertMany(ALL_CARDS);
  }
}

function rowToCard(row: Record<string, unknown>): TerraformingMarsCard {
  return {
    id: row.id as number,
    name: row.name as string,
    cost: row.cost as number,
    type: row.type as CardType,
    tags: JSON.parse(row.tags as string) as Tag[],
    expansion: row.expansion as Expansion,
    requirements: row.requirements ? JSON.parse(row.requirements as string) : undefined,
    effects: JSON.parse(row.effects as string),
    cardNumber: row.card_number as string,
  };
}

export function getAllCards(): TerraformingMarsCard[] {
  const database = getDb();
  const rows = database.prepare("SELECT * FROM cards ORDER BY id").all();
  return rows.map((row) => rowToCard(row as Record<string, unknown>));
}

export function getCardById(id: number): TerraformingMarsCard | null {
  const database = getDb();
  const row = database.prepare("SELECT * FROM cards WHERE id = ?").get(id);
  if (!row) return null;
  return rowToCard(row as Record<string, unknown>);
}

export function searchCards(query: string): TerraformingMarsCard[] {
  const database = getDb();
  const rows = database
    .prepare("SELECT * FROM cards WHERE name LIKE ? ORDER BY name")
    .all(`%${query}%`);
  return rows.map((row) => rowToCard(row as Record<string, unknown>));
}

export function getCardsByType(type: CardType): TerraformingMarsCard[] {
  const database = getDb();
  const rows = database
    .prepare("SELECT * FROM cards WHERE type = ? ORDER BY name")
    .all(type);
  return rows.map((row) => rowToCard(row as Record<string, unknown>));
}

export function getCardsByTag(tag: string): TerraformingMarsCard[] {
  const database = getDb();
  const rows = database
    .prepare("SELECT * FROM cards WHERE tags LIKE ? ORDER BY name")
    .all(`%"${tag}"%`);
  return rows.map((row) => rowToCard(row as Record<string, unknown>));
}

export function getCardsByExpansion(expansion: Expansion): TerraformingMarsCard[] {
  const database = getDb();
  const rows = database
    .prepare("SELECT * FROM cards WHERE expansion = ? ORDER BY name")
    .all(expansion);
  return rows.map((row) => rowToCard(row as Record<string, unknown>));
}
