import React, { useState } from "react";

function QuestionForm(props) {
  const [formData, setFormData] = useState({
    prompt: '',
    answers: ['', '', '', ''],
    correctIndex: 0,
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetch('http://localhost:4000/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: formData.prompt,
        answers: formData.answers,
        correctIndex: formData.correctIndex,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error creating question');
        }
      })
      .then((newQuestion) => {
        props.onAddQuestion(newQuestion);
      })
      .catch((error) => {
        console.error('Error creating question:', error);
      });
  }

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type='text'
            name='prompt'
            value={formData.prompt}
            onChange={handleChange}
          />
        </label>
        {formData.answers.map((answer, index) => (
          <label key={index}>
            Answer {index + 1}:
            <input
              type='text'
              name={`answers[${index}]`}
              value={answer}
              onChange={(e) => {
                const newAnswers = [...formData.answers];
                newAnswers[index] = e.target.value;
                setFormData({ ...formData, answers: newAnswers });
              }}
            />
            <input
              type='checkbox'
              name={`correctIndex[${index}]`}
              checked={index === formData.correctIndex}
              onChange={() => {
                const newCorrectIndex =
                  index === formData.correctIndex ? -1 : index;
                setFormData({ ...formData, correctIndex: newCorrectIndex });
              }}
            />
          </label>
        ))}
        <button type='submit'>Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;
