import React, { useState } from 'react';

function QuestionForm(props) {
  const initialFormData = {
    prompt: '',
    answers: ['', '', '', ''],
    correctIndex: 0,
  };

  const [formData, setFormData] = useState(initialFormData);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'prompt') {
      setFormData({
        ...formData,
        prompt: value,
      });
    } else if (name.startsWith('answers')) {
      const index = parseInt(name.match(/\d+/)[0], 10);
      const updatedAnswers = [...formData.answers];
      updatedAnswers[index] = value;

      setFormData({
        ...formData,
        answers: updatedAnswers,
      });
    }
  }

  function handleAnswerChange(e) {
    const newCorrectIndex = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      correctIndex: newCorrectIndex,
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
              onChange={handleChange}
            />
          </label>
        ))}
        <label>
          Correct Answer:
          <select value={formData.correctIndex} onChange={handleAnswerChange}>
            <option value='-1'>Select</option>
            {formData.answers.map((answer, index) => (
              <option key={index} value={index}>
                {answer}
              </option>
            ))}
          </select>
        </label>
        <button type='submit'>Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;
