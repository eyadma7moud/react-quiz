function FinishButton({ dispatch, answer }) {
  return (
    answer !== null && (
      <button
        className="btn btn-ui btn-finish"
        onClick={() => dispatch({ type: "finished" })}
      >
        Finish
      </button>
    )
  );
}

export default FinishButton;
