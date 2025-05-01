const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'; // Use environment variable

export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${API_URL}/questions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    // Depending on desired PWA offline behavior, you might return cached data or an empty array
    return [];
  }
};