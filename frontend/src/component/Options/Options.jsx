import React from "react";
import './Options.css';
function Options(props) {
  const data = [
    {
      text: "Linux",
      handler: props.actionProvider.handleLinuxQuiz,
      id: 1
    },
    {
      text: "Docker",
      handler: props.actionProvider.handleDockerQuiz,
      id: 2
    },
    {
      text: "Sql",
      handler: props.actionProvider.handleSqlQuiz,
      id: 3
    }
  ];
  const optionsList = data.map((option) => (
    <button class='optionButton' key={option.id} onClick={option.handler}>
      {option.text}
    </button>
  ));
  return (
    <div>
      <p>{optionsList}</p>
    </div>
  );
}
export default Options;
