import React, { useState, useEffect } from 'react';
import QuestionItem from './QuestionItem';

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/questions')
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  const handleAnswerChange = (id, newCorrectIndex) => {
    const updatedQuestion = {
      ...questions.find((q) => q.id === id),
      correctIndex: newCorrectIndex,
    };
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correctIndex: newCorrectIndex,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setQuestions(
            questions.map((q) => (q.id === id ? updatedQuestion : q))
          );
        } else {
          throw new Error('Error updating question');
        }
      })
      .catch((error) => {
        console.error('Error updating question:', error);
      });
  };

  function handleDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setQuestions(questions.filter((question) => question.id !== id));
      })
      .catch((error) => console.error('Error deleting question:', error));
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {/* display QuestionItem components here after fetching */}
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onAnswerChange={(newCorrectIndex) =>
              handleAnswerChange(question.id, newCorrectIndex)
            }
            onDelete={() => handleDeleteQuestion(question.id)}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
