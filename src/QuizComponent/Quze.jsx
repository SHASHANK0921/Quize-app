import { useContext, useState, useEffect } from "react";
import "./Quze.css";
import { MyContext } from "../Context.jsx";

const Quze = () => {
  const { data } = useContext(MyContext);
  const [quizData, setQuizData] = useState([...data]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [username, setUsername] = useState("");

  // ✅ Load username
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.username) setUsername(user.username);
  }, []);

  // ✅ Timer logic
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  // ✅ Shuffle function
  const shuffleQuestions = (questions) => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  if (!Array.isArray(data) || data.length === 0) {
    return <h2>No quiz data found.</h2>;
  }

  const currentQuestion = quizData[index];
  const answeredCount = Object.keys(answers).length;
  const remainingCount = quizData.length - answeredCount;

  // Handlers
  const handleSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleNext = () => {
    if (index < quizData.length - 1) setIndex(index + 1);
  };

  const handlePrevious = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSkip = () => {
    if (index < quizData.length - 1) setIndex(index + 1);
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the quiz?"
    );
    if (confirmSubmit) calculateScore();
  };

  const handleAutoSubmit = () => {
    if (isFinished) return;
    alert("⏰ Time’s up! Quiz auto-submitted.");
    calculateScore();
  };

  const calculateScore = () => {
    let newScore = 0;
    quizData.forEach((q) => {
      if (answers[q.id] === q.answer) newScore++;
    });
    setScore(newScore);
    setIsSubmitted(true);
    setIsFinished(true);
  };

  // ✅ Restart Quiz (reset + shuffle)
  const handleRestartQuiz = () => {
    const shuffled = shuffleQuestions(data);
    setQuizData(shuffled);
    setAnswers({});
    setScore(0);
    setIndex(0);
    setIsFinished(false);
    setIsSubmitted(false);
    setTimeLeft(20 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ✅ Result Page
  if (isFinished) {
    return (
      <div className="result-page">
        <h1>🎉 Quiz Completed!</h1>
        <h2>
          Your Score: {score} / {quizData.length}
        </h2>

        <div className="result-list">
          {quizData.map((q) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.answer;
            return (
              <div
                key={q.id}
                className={`result-card ${isCorrect ? "correct" : "wrong"}`}
              >
                <h3>
                  {q.id}. {q.question}
                </h3>
                <p>
                  <strong>Your Answer:</strong>{" "}
                  <span style={{ color: isCorrect ? "green" : "red" }}>
                    {userAnswer ?? "Not Answered"}
                  </span>
                </p>
                <p>
                  <strong>Correct Answer:</strong>{" "}
                  <span style={{ color: "green" }}>{q.answer}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* ✅ Restart Button */}
        <button className="restart-btn" onClick={handleRestartQuiz}>
          🔁 Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <div>
          {username && <h3 className="quiz-username">👤 {username}</h3>}
          <h1>Java & React Quiz</h1>
        </div>

        <div className="quiz-info-top">
          <div className="timer-fixed">
            ⏰{" "}
            <span className={`timer-text ${timeLeft <= 60 ? "urgent" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="quiz-stats-top">
            <span className="answered">Answered: {answeredCount}</span>
            <span className="remaining">Remaining: {remainingCount}</span>
          </div>
        </div>
      </header>

      <div className="quiz-layout">
        <div className="quiz-card">
          <h2>
            {index + 1}. {currentQuestion.question}
          </h2>

          <div className="options">
            {currentQuestion.options.map((option, i) => {
              const selected = answers[currentQuestion.id] === option;
              const correct =
                isSubmitted && option === currentQuestion.answer;
              const wrong =
                isSubmitted && selected && option !== currentQuestion.answer;

              return (
                <label
                  key={i}
                  className={`option-label ${
                    correct ? "correct" : wrong ? "wrong" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQuestion.id}`}
                    value={option}
                    checked={selected}
                    onChange={() =>
                      handleSelect(currentQuestion.id, option)
                    }
                    disabled={isSubmitted}
                  />
                  {option}
                </label>
              );
            })}
          </div>

          <div className="nav-buttons">
            <button
              onClick={handlePrevious}
              disabled={index === 0}
              className="prev-btn"
            >
              Previous
            </button>

            <div className="nav-right">
              {index < quizData.length - 1 ? (
                <>
                  <button onClick={handleNext} className="next-btn">
                    Next
                  </button>
                  <button onClick={handleSkip} className="skip-btn">
                    Skip
                  </button>
                </>
              ) : (
                <button onClick={handleSubmit} className="submit-btn">
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="quiz-sidebar">
          <h3>Question Status</h3>
          <div className="question-numbers">
            {quizData.map((q, i) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.answer;
              const isAnswered = userAnswer !== undefined;
              const active = i === index ? "active" : "";

              let statusClass = "unanswered";
              if (isSubmitted) {
                if (isAnswered && isCorrect) statusClass = "correct";
                else if (isAnswered && !isCorrect) statusClass = "wrong";
              } else if (isAnswered) {
                statusClass = "correct"; // green for answered
              }

              return (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`q-num-btn ${statusClass} ${active}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Quze;
