import React from 'react';
import Button from './Button';
import Card from './Card';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css'; // Import component specific styles

const QuizResult = () => {
  const { score, questions, resetQuiz } = useQuiz();
  const navigate = useNavigate();
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  const handleRetry = () => {
    resetQuiz();
    navigate('/'); // Go back to home or quiz setup page
  };

  // Optional: Add a button to review answers if you stored userAnswers and correct answers
  // const handleReview = () => {
  //     // Navigate to a review page or show questions with user answers and correct answers
  //     console.log("Review quiz results");
  // };

  return (
    <Card
        header={<h1>Resultados del Test</h1>}
        footer={
            <div className="button-group">
                 <Button onClick={handleRetry}>Hacer otro intento</Button>
                 {/* Optional: <Button onClick={handleReview}>Revisar Respuestas</Button> */}
            </div>
        }
    >
      <div className="quiz-result">
        <p>Has completado el test.</p>
        <div className="quiz-summary">
          <p>Preguntas totales: {totalQuestions}</p>
          <p className="correct">Respuestas correctas: {score}</p>
          <p className="incorrect">Respuestas incorrectas: {totalQuestions - score}</p>
          <p>Porcentaje de acierto: {percentage.toFixed(2)}%</p>
        </div>
      </div>
    </Card>
  );
};

export default QuizResult;