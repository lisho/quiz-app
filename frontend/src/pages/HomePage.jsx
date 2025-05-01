import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext.jsx';
import { fetchQuestions } from '../api/questionsApi';
import Layout from '../components/Layout.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import '../styles/pages.css'; // Import page specific styles

const HomePage = () => {
  const navigate = useNavigate();
  const { startQuiz, questions } = useQuiz();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions when the component mounts
  useEffect(() => {
      const loadQuestions = async () => {
          setLoading(true);
          setError(null);
          try {
              const allQuestions = await fetchQuestions();
              if (allQuestions.length > 0) {
                 // Don't start quiz immediately, just load and store questions
                 startQuiz(allQuestions); // startQuiz also shuffles and resets state
              } else {
                 setError("No se pudieron cargar las preguntas.");
              }
          } catch (err) {
              setError("Error al conectar con el servidor. Inténtalo de nuevo.");
              console.error("Fetch failed in HomePage:", err);
          } finally {
              setLoading(false);
          }
      };

      // Only load if questions are not already loaded or there was an error previously
      // We reset quiz state on startQuiz, so reloading questions is fine
      loadQuestions();

  }, [startQuiz]); // Depend on startQuiz which is wrapped in useCallback


  const handleStartQuiz = () => {
    if (questions.length > 0) {
        // startQuiz should have already been called by the effect,
        // but calling it again ensures a fresh quiz if needed
        startQuiz(questions);
        navigate('/quiz');
    }
  };

  return (
    <Layout>
        <div className="home-page">
            <h1>Prepárate para tu examen</h1>
            <p>Practica con preguntas oficiales para asegurar tu éxito.</p>

            {loading && <p>Cargando preguntas...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && questions.length > 0 && (
                 <Button onClick={handleStartQuiz} disabled={loading || questions.length === 0}>
                    Empezar Test ({questions.length} preguntas)
                 </Button>
            )}
             {!loading && !error && questions.length === 0 && (
                 <p>No hay preguntas disponibles para iniciar el test.</p>
            )}

        </div>
    </Layout>
  );
};

export default HomePage;