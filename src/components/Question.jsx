import Options from "./Options";

function Question({ question, dispatch, answer, points }) {
  return (
    <div>
      <h4>{question.question}&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontSize: "2rem" }}>{points} points</span></h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
