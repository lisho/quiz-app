import React, { useMemo } from 'react';
import { useQuiz } from '../context/QuizContext.jsx';
import { useNavigate } from 'react-router-dom';
import QuizResult from '../components/QuizResult';
import Layout from '../components/Layout';
import FailedQuestionReview from '../components/FailedQuestionReview.jsx';

import '../styles/pages.css'; // Import page specific styles
import '../styles/FailedQuestionReview.css'; // Import component specific styles
import { useEffect } from 'react';

const ResultPage = () => {
  const { quizCompleted, questions, userAnswers, score } = useQuiz();
   const navigate = useNavigate();
    // Redirigir si el quiz no está completo o no hay preguntas
    useEffect(() => {
      if (!quizCompleted || questions.length === 0) {
          navigate('/');
      }
  }, [quizCompleted, questions.length, navigate]);

  // --- LÓGICA PARA ENCONTRAR PREGUNTAS FALLADAS ---
  // Usamos useMemo para evitar recalcular en cada render a menos que cambien las dependencias
  const failedQuestionsData = useMemo(() => {
      if (!questions || !userAnswers) return [];

      return questions
          .map((question, index) => ({
              ...question,
              userAnswerIndex: userAnswers[index], // Añadir la respuesta del usuario
              originalIndex: index // Guardar el índice original si lo necesitamos para el número
          }))
          .filter((questionData) =>
              // Fallada si el usuario respondió (no es null) Y su respuesta no es la correcta
              questionData.userAnswerIndex !== null &&
              questionData.userAnswerIndex !== questionData.correcta
          );
  }, [questions, userAnswers]); // Depende de las preguntas y las respuestas del usuario

  // Si no hay quiz completo o preguntas, no renderizar nada aún
  if (!quizCompleted || questions.length === 0) {
      return null;
  }

  return (
      <Layout>
          <div className="result-page">
              {/* El componente QuizResult muestra el resumen general */}
              <QuizResult />

              {/* --- NUEVA SECCIÓN PARA REVISAR FALLOS --- */}
              {failedQuestionsData.length > 0 && (
                  <div className="failed-questions-section">
                      <h2>Repaso de Preguntas Falladas ({failedQuestionsData.length})</h2>
                      {failedQuestionsData.map((qData) => (
                          <FailedQuestionReview
                              key={qData.id} // Usar ID único de la pregunta como key
                              question={qData}
                              userAnswerIndex={qData.userAnswerIndex}
                              // Usamos el índice original + 1 para el número de pregunta
                              questionNumber={qData.originalIndex + 1}
                          />
                      ))}
                  </div>
              )}
               {/* Mensaje si no hubo fallos */}
               {failedQuestionsData.length === 0 && score === questions.length && (
                  <div className="no-failed-questions-section">
                     <h2>¡Enhorabuena!</h2>
                     <p>¡Has acertado todas las preguntas!</p>
                  </div>
               )}
          </div>
      </Layout>
  );
};
export default ResultPage;