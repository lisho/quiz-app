import { getDatabase } from './db.js';

// --- MODIFICAR ESTA FUNCIÓN ---
// Ahora agrupa temas por bloque
export async function getFilterOptionsFromDB() {
    const db = getDatabase();
    // Obtenemos todas las combinaciones únicas de bloque y tema
    const rows = await db.all("SELECT DISTINCT bloque, tema FROM questions ORDER BY bloque, tema");

    const options = {};
    rows.forEach(row => {
        if (!options[row.bloque]) {
            options[row.bloque] = []; // Inicializa el array para este bloque si no existe
        }
        if (row.tema) { // Asegurarse de que el tema no sea null/undefined
            options[row.bloque].push(row.tema);
        }
    });

    // Extraer solo los nombres de los bloques para la lista principal
    const bloquesList = Object.keys(options).sort(); // Ordenar alfabéticamente los bloques

    return {
        bloques: bloquesList,
        temasPorBloque: options // Estructura: { "BLOQUE I": ["TEMA 1", ...], ... }
    };
}

// --- NUEVA FUNCIÓN ---
// Para contar preguntas según filtros (maneja "ALL" omitiendo el filtro)
export async function countQuestionsFromDB(filters = {}) {
    const db = getDatabase();
    let query = "SELECT COUNT(*) as count FROM questions";
    const whereClauses = [];
    const params = [];

    if (filters.bloque) { // Si se especificó un bloque (no "ALL")
        whereClauses.push("bloque = ?");
        params.push(filters.bloque);
    }

    if (filters.tema) { // Si se especificó un tema (no "ALL")
        whereClauses.push("tema = ?");
        params.push(filters.tema);
    }
    // NOTA: Si no se especifica bloque o tema, no se añade la cláusula WHERE para ellos.

    if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
    }

    // console.log("Executing Count Query:", query, params); // Para depuración
    const result = await db.get(query, params);
    return result.count || 0;
}


// getQuestionsFromDB (modificación menor o sin cambios necesarios)
// La lógica IN sigue funcionando con un solo valor, pero podemos simplificarla si queremos.
// Por ahora, la dejamos como está, ya que funciona. Si quisiéramos optimizarla para = en lugar de IN
// cuando solo hay un valor, podríamos hacerlo, pero no es crítico.
export async function getQuestionsFromDB(filters = {}, limit = null) {
    const db = getDatabase();
    let query = "SELECT * FROM questions";
    const whereClauses = [];
    const params = [];

    // Ajuste: Si viene un solo bloque/tema, usar '=' es más eficiente que 'IN (?)'
    if (filters.bloque) {
        whereClauses.push(`bloque = ?`);
        params.push(filters.bloque);
    }
    if (filters.tema) {
         whereClauses.push(`tema = ?`);
         params.push(filters.tema);
    }
    // --- FIN DEL AJUSTE ---

    if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " ORDER BY RANDOM()";

    if (limit !== null && typeof limit === 'number' && limit > 0) {
        query += " LIMIT ?";
        params.push(limit);
    }

    const rows = await db.all(query, params);

    // Reconstruct the 'respuestas' array (igual que antes)
    // ... (código de mapeo sin cambios) ...
    return rows.map(row => {
        const respuestas = [];
        if (row.respuesta0 !== null) respuestas.push(row.respuesta0);
        if (row.respuesta1 !== null) respuestas.push(row.respuesta1);
        if (row.respuesta2 !== null) respuestas.push(row.respuesta2);
        if (row.respuesta3 !== null) respuestas.push(row.respuesta3);

        return {
            id: row.id,
            bloque: row.bloque,
            tema: row.tema,
            pregunta: row.pregunta,
            respuestas: respuestas,
            correcta: row.correcta,
            explicacion: row.explicacion
        };
    });
}