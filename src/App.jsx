import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./components/Header";
import { Mainn } from "./components/Mainn";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScrean from "./components/StartScrean";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import FinishButton from "./components/FinishButton";

const initialState = {
  questions: [],

  //? loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "newAnswer": {
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion": {
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    }
    case "prevQuestion": {
      return {
        ...state,
        index: state.index - 1,
      };
    }
    case "finished": {
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    }
    case "restart":
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const numQuestions = state.questions.length;
  const maxPoints = state.questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Mainn>
        {state.status === "loading" && <Loader />}
        {state.status === "error" && <Error />}
        {state.status === "ready" && (
          <StartScrean numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {state.status === "active" && (
          <>
            <Progress
              index={state.index}
              numQuestions={numQuestions}
              points={state.points}
              maxPoints={maxPoints}
            />
            <Question
              question={state.questions[state.index]}
              points={state.questions[state.index].points}
              dispatch={dispatch}
              answer={state.answer}
            />

            {state.index !== numQuestions - 1 ? (
              <NextButton dispatch={dispatch} answer={state.answer} />
            ) : (
              <FinishButton dispatch={dispatch} answer={state.answer} />
            )}
          </>
        )}
        {state.status === "finished" && (
          <FinishScreen
            dispatch={dispatch}
            points={state.points}
            maxPoints={maxPoints}
            highscore={state.highscore}
          />
        )}
      </Mainn>
    </div>
  );
}
