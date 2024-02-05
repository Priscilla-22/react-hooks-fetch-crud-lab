import React, { useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
    const [questions, setQuestions] = useState([]);

    function handleAddQuestion(newQuestion) {
      setQuestions([...questions, newQuestion]);
    }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === 'List' && <QuestionList questions={questions} />}
      {page === 'Form' && <QuestionForm onAddQuestion={handleAddQuestion} />}
    </main>
  );
}

export default App;
