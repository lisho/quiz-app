import { getDatabase } from './db.js';

export async function getAllQuestionsFromDB() {
  const db = getDatabase();
  const rows = await db.all("SELECT * FROM questions");

  // Reconstruct the 'respuestas' array from columns
  return rows.map(row => {
    const respuestas = [];
    if (row.respuesta0 !== null) respuestas.push(row.respuesta0);
    if (row.respuesta1 !== null) respuestas.push(row.respuesta1);
    if (row.respuesta2 !== null) respuestas.push(row.respuesta2);
    if (row.respuesta3 !== null) respuestas.push(row.respuesta3);

    return {
      id: row.id, // Include ID for potential future use
      bloque: row.bloque,
      tema: row.tema,
      pregunta: row.pregunta,
      respuestas: respuestas,
      correcta: row.correcta,
      explicacion: row.explicacion
    };
  });
}