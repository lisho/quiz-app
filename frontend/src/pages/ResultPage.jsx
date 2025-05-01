import React from 'react';
import { useQuiz } from '../context/QuizContext.jsx';
import { useNavigate } from 'react-router-dom';
import QuizResult from '../components/QuizResult';
import Layout from '../components/Layout';
import '../styles/pages.css'; // Import page specific styles
import { useEffect } from 'react';

const ResultPage = () => {
  const { quizCompleted, questions } = useQuiz();
   const navigate = useNavigate();

   // If somehow reached here without completing the quiz, redirect home
   useEffect(() => {
       if (!quizCompleted || questions.length === 0) {
           navigate('/');
       }
   }, [quizCompleted, questions.length, navigate]);

    if (!quizCompleted || questions.length === 0) {
        return null; // Or a loading/redirecting message
    }


  return (
    <Layout>
      <div className="result-page">
        <QuizResult />
      </div>
    </Layout>
  );
};

export default ResultPage;