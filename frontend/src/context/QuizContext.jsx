import React, { createContext, useState, useContext, useCallback } from 'react';
import { shuffleArray } from '../utils/quizUtils';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Array of selected answer indices
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Currently selected answer index for the active question

  const startQuiz = useCallback((allQuestions) => {
    const shuffledQuestions = shuffleArray(allQuestions); // Shuffle questions on start
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(shuffledQuestions.length).fill(null)); // Initialize with nulls
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
    setSelectedAnswer(null);
  }, []);

  const selectAnswer = useCallback((answerIndex) => {
    if (!showExplanation) { // Only allow selection before submitting
        setSelectedAnswer(answerIndex);
    }
  }, [showExplanation]);

  const submitAnswer = useCallback(() => {
    if (selectedAnswer === null) return; // Don't submit if no answer is selected

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correcta;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer; // Store the selected answer
    setUserAnswers(newUserAnswers);

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    setShowExplanation(true); // Show explanation after submission
  }, [questions, currentQuestionIndex, userAnswers, selectedAnswer]);


  const goToNextQuestion = useCallback(() => {
    setShowExplanation(false);
    setSelectedAnswer(null); // Reset selected answer for the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  }, [currentQuestionIndex, questions.length]);

  const resetQuiz = useCallback(() => {
    // We'll re-fetch/re-shuffle on startQuiz from HomePage
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
    setSelectedAnswer(null);
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
    startQuiz,
    selectAnswer,
    submitAnswer,
    goToNextQuestion,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};