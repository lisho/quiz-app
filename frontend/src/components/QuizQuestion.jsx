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
    processAnswerSelection,
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
    // Aplicar 'selected' solo si la explicación NO se muestra aún y es el seleccionado
    // O si la explicación SÍ se muestra y este fue el seleccionado
    if (selectedAnswer !== null && selectedAnswer === index) {
         // El estilo 'selected' se aplica visualmente ANTES de que
         // los estilos correct/incorrect tomen precedencia si showExplanation es true
         className += ' selected';
    }
    if (showExplanation) {
        if (index === currentQuestion.correcta) {
            className += ' correct'; // Siempre marca la correcta en verde
        } else if (selectedAnswer === index && selectedAnswer !== currentQuestion.correcta) {
            className += ' incorrect'; // Marca la incorrecta seleccionada en rojo
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
            // --- LÓGICA DEL BOTÓN MODIFICADA ---
            // Mostrar el botón "Siguiente" SOLO cuando la explicación esté visible
            showExplanation && (
                <div className="button-group">
                    <Button onClick={goToNextQuestion}>
                        {isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'}
                    </Button>
                </div>
            )
            // No mostrar nada si la explicación no está visible
        }
    >
        <div className="quiz-question">
            <p>{currentQuestion.pregunta}</p>
            <ul className="answer-options">
                {currentQuestion.respuestas.map((respuesta, index) => (
                    <li key={index}>
                        <button
                            className={getAnswerButtonClass(index)}
                            // --- ONCLICK MODIFICADO ---
                            // Llama directamente a processAnswerSelection
                            onClick={() => processAnswerSelection(index)}
                            // Deshabilitar botones una vez que se muestra la explicación
                            disabled={showExplanation}
                        >
                            {respuesta}
                        </button>
                    </li>
                ))}
            </ul>

            {/* La explicación se muestra igual que antes, cuando showExplanation es true */}
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