// ask whether the answer meets 
import React from "react";
import './Options.css';
function OptionsQuestionVideo(props) {
  const data = [
    {
      text: "See more related questions",
      handler: props.actionProvider.handleRelate,
      id: 1
    },
    {
      text: "Yes, I am satisfied with those answers",
      handler: props.actionProvider.handleGreeting,
      id: 2
    },
    {
      text: "No, those are not what I want",
      handler: props.actionProvider.handleSorry,
      id: 3
    }
  ];
  const optionsList = data.map((option) => (
    <button class='optionButton' key={option.id} onClick={option.handler}>
        {option.text}
    </button>
  ));
  return (
    <div style={{ marginLeft: '30px' }}>
      <p>{optionsList}</p>
    </div>
  );
}
export default OptionsQuestionVideo;
