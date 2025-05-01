import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import QuizQuestion from '../components/QuizQuestion.jsx';
import Layout from '../components/Layout';
import '../styles/pages.css'; // Import page specific styles
import { useEffect } from 'react';

const QuizPage = () => {
  const { quizCompleted, questions } = useQuiz();
  const navigate = useNavigate();

  // Redirect to results page when quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      navigate('/results');
    }
  }, [quizCompleted, navigate]);

  // If somehow reached here without questions, redirect home
  useEffect(() => {
      if (questions.length === 0 && !quizCompleted) {
          navigate('/');
      }
  }, [questions.length, quizCompleted, navigate]);


  // Only render if there are questions and the quiz is not completed
  if (questions.length === 0 || quizCompleted) {
      return null; // Or a loading/redirecting message
  }


  return (
    <Layout>
      <div className="quiz-page">
        <QuizQuestion />
        {/* You could add a progress bar here */}
        {/* <p>Progress: {currentQuestionIndex + 1}/{questions.length}</p> */}
      </div>
    </Layout>
  );
};

export default QuizPage;