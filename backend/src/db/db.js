import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';
// Get directory name for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../db/quiz.sqlite');
const jsonDataPath = path.resolve(__dirname, '../../data/preguntas.json');

let db = null;

export async function initializeDatabase() {
  try {
    // Ensure the db directory exists
    const dbDir = path.dirname(dbPath); // Obtiene el directorio de la ruta del archivo DB
    await mkdir(dbDir, { recursive: true }); // Crea el directorio (y padres si es necesario), no falla si ya existe
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bloque TEXT,
        tema TEXT,
        pregunta TEXT,
        respuesta0 TEXT,
        respuesta1 TEXT,
        respuesta2 TEXT,
        respuesta3 TEXT, -- Assuming max 4 answers based on data
        correcta INTEGER,
        explicacion TEXT
      )
    `);

    // Check if data already exists
    const count = await db.get("SELECT COUNT(*) as count FROM questions");
    if (count.count === 0) {
      console.log('Database is empty. Loading data from JSON...');
      const data = fs.readFileSync(jsonDataPath, 'utf-8');
      const questions = JSON.parse(data);

      const insert = await db.prepare(`
        INSERT INTO questions (bloque, tema, pregunta, respuesta0, respuesta1, respuesta2, respuesta3, correcta, explicacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const q of questions) {
        // Handle cases where there are fewer than 4 answers
        const responses = q.respuestas || [];
        await insert.run(
          q.bloque,
          q.tema,
          q.pregunta,
          responses[0] || null,
          responses[1] || null,
          responses[2] || null,
          responses[3] || null,
          q.correcta,
          q.explicacion
        );
      }

      await insert.finalize();
      console.log('Data loaded successfully.');
    } else {
      console.log('Database already contains data.');
    }

    console.log('Database initialized.');
    return db;

  } catch (error) {
    console.error('Error initializing database:', error.message);
    // Exit process or handle error appropriately
    process.exit(1);
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}