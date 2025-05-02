import React from 'react';
import '../styles/components.css'; // O un CSS específico si prefieres

const FailedQuestionReview = ({ question, userAnswerIndex, questionNumber }) => {
    const { pregunta, respuestas, correcta, explicacion } = question;

    return (
        <div className="failed-question-review card"> {/* Usamos card para un estilo consistente */}
            <h4>Pregunta #{questionNumber}: {pregunta}</h4>
            <ul className="answer-options-review">
                {respuestas.map((respuesta, index) => {
                    let itemClass = 'answer-review-item';
                    if (index === correcta) {
                        itemClass += ' correct'; // Estilo para la correcta
                    }
                    if (index === userAnswerIndex) {
                         // Asegurarse que no sobreescriba el 'correct' si el usuario acertó
                         // aunque esta sección sólo mostrará falladas
                        itemClass += ' user-incorrect'; // Estilo para la incorrecta del usuario
                    }

                    return (
                        <li key={index} className={itemClass}>
                            {respuesta}
                            {index === correcta && ' (Correcta)'}
                            {index === userAnswerIndex && ' (Tu respuesta)'}
                        </li>
                    );
                })}
            </ul>
            <div className="explanation-review">
                <strong>Explicación:</strong> {explicacion}
            </div>
        </div>
    );
};

export default FailedQuestionReview;