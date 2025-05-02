import React, { createContext, useState, useContext, useCallback } from 'react';
// No necesitamos shuffleArray aquí si la DB ya devuelve aleatorio y limitado
// import { shuffleArray } from '../utils/quizUtils';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // --- MODIFICAR ESTA FUNCIÓN ---
    // Ahora simplemente recibe las preguntas ya preparadas
    const startQuiz = useCallback((quizQuestions) => {
        if (!quizQuestions || quizQuestions.length === 0) {
            console.error("Attempted to start quiz with no questions.");
            // Podríamos manejar un error aquí o dejar que HomePage lo haga
            setQuestions([]); // Asegurar que esté vacío si no hay preguntas
            return;
        }
        // No necesita barajar aquí si la API ya lo hizo (ORDER BY RANDOM)
        setQuestions(quizQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(quizQuestions.length).fill(null));
        setScore(0);
        setQuizCompleted(false);
        setShowExplanation(false);
        setSelectedAnswer(null);
    }, []);

     // Se llama directamente al hacer clic en una respuesta
     const processAnswerSelection = useCallback((answerIndex) => {
        // No hacer nada si la explicación ya se muestra (previene doble procesamiento)
        if (showExplanation) return;

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return; // Safety check

        // 1. Marcar la respuesta seleccionada por el usuario
        setSelectedAnswer(answerIndex);

        // 2. Evaluar si es correcta
        const isCorrect = answerIndex === currentQuestion.correcta;

        // 3. Actualizar puntuación si es correcta
        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }

        // 4. Registrar la respuesta del usuario (para posible revisión futura)
        const newUserAnswers = [...userAnswers];
        newUserAnswers[currentQuestionIndex] = answerIndex;
        setUserAnswers(newUserAnswers);

        // 5. Mostrar inmediatamente la explicación y el feedback visual
        setShowExplanation(true);

    }, [questions, currentQuestionIndex, userAnswers, showExplanation]); // Añadir showExplanation a las dependencias
   
   
  

     const goToNextQuestion = useCallback(() => {
        setShowExplanation(false);
        setSelectedAnswer(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            setQuizCompleted(true);
        }
     }, [currentQuestionIndex, questions.length]);

    // --- resetQuiz ---
    const resetQuiz = useCallback(() => {
        // Limpiamos el estado del quiz
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setScore(0);
        setQuizCompleted(false);
        setShowExplanation(false);
        setSelectedAnswer(null);
        // La configuración (filtros, etc.) se maneja en HomePage
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    const value = {
        questions,
        currentQuestionIndex,
        currentQuestion,
        userAnswers,
        score,
        quizCompleted,
        showExplanation,
        selectedAnswer,
        startQuiz, // Modificada
        processAnswerSelection,
        goToNextQuestion,
        resetQuiz,
    };

    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

// useQuiz hook sin cambios
export const useQuiz = () => {
    // ... (código existente de useQuiz) ...
     const context = useContext(QuizContext);
     if (!context) {
       throw new Error('useQuiz must be used within a QuizProvider');
     }
     return context;
};