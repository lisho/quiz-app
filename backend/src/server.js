import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/db.js';
import questionsRouter from './routes/questions.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES Modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows frontend on different port to access
app.use(express.json()); // To parse JSON request bodies (not strictly needed for GET, but good practice)

// API Routes
app.use('/api/questions', questionsRouter);

// Serve frontend static files (after build)
// In production, the frontend build would be served here.
// For development, we rely on the frontend dev server (Vite/CRA)
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../../frontend/dist'); // Adjust 'dist' if using CRA (usually 'build')
  app.use(express.static(frontendBuildPath));

  // Serve index.html for any unknown routes (for React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}


// Database initialization and server start
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend server running on http://localhost:${port}`);
      if (process.env.NODE_ENV !== 'production') {
          console.log('Frontend development server should be running separately.');
      } else {
          console.log(`Serving static frontend from ${path.join(__dirname, '../../frontend/dist')}`);
      }
    });
  })
  .catch(error => {
    console.error('Failed to start server due to database error:', error);
    process.exit(1);
  });