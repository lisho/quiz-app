import { getAllQuestionsFromDB } from '../db/queries.js';

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export const getQuestions = async (req, res) => {
  try {
    const questions = await getAllQuestionsFromDB();
    // Optional: Shuffle questions before sending
    const shuffledQuestions = shuffleArray(questions);
    res.json(shuffledQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};