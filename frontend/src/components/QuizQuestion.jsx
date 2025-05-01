import React from 'react';
import Button from './Button';
import Card from './Card';
import { useQuiz } from '../context/QuizContext';
import '../styles/components.css'; // Import component specific styles

const QuizQuestion = () => {
  const {
    currentQuestion,
    currentQuestionIndex,
    questions,
    selectAnswer,
    submitAnswer,
    goToNextQuestion,
    showExplanation,
    selectedAnswer
  } = useQuiz();

  if (!currentQuestion) {
    return <Card>Cargando pregunta...</Card>;
  }

  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const getAnswerButtonClass = (index) => {
      let className = 'answer-button';
      if (selectedAnswer !== null && selectedAnswer === index) {
          className += ' selected';
      }
      if (showExplanation) {
          if (index === currentQuestion.correcta) {
              className += ' correct';
          } else if (selectedAnswer === index && selectedAnswer !== currentQuestion.correcta) {
              className += ' incorrect';
          }
      }
      return className;
  };

  return (
    <Card
      header={
        <>
          <h2>Pregunta {currentQuestionIndex + 1} de {totalQuestions}</h2>
          <p className="quiz-info">Bloque: {currentQuestion.bloque} | Tema: {currentQuestion.tema}</p>
        </>
      }
      footer={
        <div className="button-group">
            {!showExplanation ? (
                <Button onClick={submitAnswer} disabled={selectedAnswer === null}>
                    Comprobar Respuesta
                </Button>
            ) : (
                <Button onClick={goToNextQuestion}>
                    {isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'}
                </Button>
            )}
        </div>
      }
    >
      <div className="quiz-question">
        <p>{currentQuestion.pregunta}</p>
        <ul className="answer-options">
          {currentQuestion.respuestas.map((respuesta, index) => (
            <li key={index}>
              <button
                className={getAnswerButtonClass(index)}
                onClick={() => selectAnswer(index)}
                disabled={showExplanation} // Disable buttons after submitting
              >
                {respuesta}
              </button>
            </li>
          ))}
        </ul>

        {showExplanation && (
            <div className="explanation">
                <p><strong>Explicación:</strong> {currentQuestion.explicacion}</p>
            </div>
        )}
      </div>
    </Card>
  );
};

export default QuizQuestion;