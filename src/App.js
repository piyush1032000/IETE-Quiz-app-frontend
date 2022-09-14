import React, {
  useRef,
  useState,
  useEffect
} from "react";

import gsap from "gsap";
import './index.scss';
import Signin from "./signin";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"



function useCounter(initialState) {
  const [value, setValue] = useState(initialState);
  const reset = () => setValue(0);
  const add = () => setValue((value) => (value += 1));
  return { value, add, reset };
}

function Question({
  data,
  buttonText,
  hasButton = true,
  onQuestionButtonClick,
  showAnswer = false,
  markSelection = null,
  answer,
  setAnswer
}) {
 
  const parseValue = (value) => (value ? parseInt(value.split("-")[1]) : null);
  const questionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      questionRef.current.querySelector(".question-text"),
      {
        x: 40,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.4
      }
    );
    gsap.fromTo(
      questionRef.current.querySelectorAll("li"),
      {
        opacity: 0,
        x: 40
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1
      }
    );
  }, [data]);

  return (
    <div className="question" ref={questionRef}>
      <div className="question-inner">
        <h2 className="question-text">{data.problem.replace(/\\n/g, '\n')}</h2>
        <ul className="question-answers">
          {data.solution.map((text, index) => {
            const value = `q${data.id}-${index}`;
            return (
              <li
                className={
                  index === data.correct && showAnswer ? "is-true" : ""
                }
                data-selected={markSelection === index ? true : null}
              >
                <input
                  type="radio"
                  name={`q_${data.id}`}
                  value={value}
                  id={value}
                  onChange={(e) => setAnswer(e.target.value)}
                  checked={
                    !showAnswer ? answer === value : markSelection === index
                  }
                />
                <label className="question-answer" htmlFor={value}>
                  {text}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      {hasButton && (
        <button
          className="question-button"
          onClick={() => onQuestionButtonClick(parseValue(answer), data)}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}


function App() {
  const [questions,setQuestions]=useState([])

  const getQuestions=()=>{

var config = {
method: 'get',
url: 'http://localhost:5000/questions',
headers: { }
};

axios(config)
.then(function (response) {
//console.log(response.data)
setQuestions(response.data)
})
.catch(function (error) {
console.log(error);
});
}

  useEffect(()=>{
    getQuestions()
  },[])

  const [name,setName]=useState("")
  const [e,setE]=useState("")
  const [c,setC]=useState("")
  const [isSignedIn,setIsSignedIn]=useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [answer,setAnswer]=useState([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1])
  const [marks,setMarks]=useState(0)
  const totalQuestion = questions.length - 1;
  const gameRef = useRef(null);
  const question = useCounter(0);

  const [ans,setAns]=useState(null)

  const submitAnswer=async (m,o)=>{

var data = JSON.stringify({
"email": e,
"name": name,
"contact": c,
"marks": m,
"options": o
});

var config = {
method: 'post',
url: 'http://localhost:5000/answers',
headers: { 
  'Content-Type': 'application/json'
},
data : data
};

await axios(config)
.then(function (response) {
console.log(JSON.stringify(response.data));
})
.catch(function (error) {
console.log(error);
});

  }

  const handleNewQuestionClick = async (selectedValue, currQuestion) => {
    let ma=marks
    let op=answer
    if(selectedValue==currQuestion["correct"])
    {
      ma+=1
      op[currQuestion["uid"]]=1
    }
    else
    {
      op[currQuestion["uid"]]=0
    }
    //console.log(ma,op)
    await submitAnswer(ma,op)
    setMarks(ma)
    setAnswer(op)
    setAns(null)
    //console.log(selectedValue,currQuestion)
    question.add();
  };

  const indicatorBg = (index) => {
    if (question.value > index) {
      return "#fff";
    } else if (question.value === index) {
      return "#29b5d5";
    } else {
      return "rgba(255,255,255,.2)";
    }
  };

  useEffect(() => {
    if (gameStarted) {
      document.body.classList.add("game-started");
    } else {
      document.body.classList.remove("game-started");
    }
  }, [gameStarted]);


  if(!isSignedIn)
  {
      return(
          <Signin setSignedIn={setIsSignedIn} setName={setName} setC={setC} setE={setE} />
      )
  }
  else{

  return (
    <div
      className="game"
      ref={gameRef}
      data-game-started={gameStarted ? true : null}
      data-game-finished={question.value > totalQuestion ? true : null}
    >
      <div className="intro">
        <div className="intro-inner">
          <h1 className="intro-title">Hello {name}</h1><br/><h1 className="intro-title">Welcome To IETE Recruitment Quiz</h1>
          {!gameStarted && (
            <>
              <p className="intro-desc">
                {`The test contains ${questions.length} questions and one hour will be provided.`}
              </p>

              <button
                className="intro-button"
                onClick={() => setGameStarted(true)}
              >
                Start Quiz
              </button>
            </>
          )}
          {gameStarted && (
            <div className="indicator">
              {questions.map((q, index) => {
                return (
                  <span
                    className="indicator-item"
                    style={{
                      backgroundColor: indicatorBg(index)
                    }}
                  />
                );
              })}
            </div>
          )}

        </div>
      </div>
      <div className="game-area">
        {questions[question.value] && (
          <Question
          answer={ans}
          setAnswer={setAns}
            data={questions[question.value]}
            buttonText={
              question.value !== totalQuestion ? "Next Question" : "Finish Quiz"
            }
            onQuestionButtonClick={handleNewQuestionClick}
          />
        )}

        
      </div>
    </div>
  );
        }
}

export default App
