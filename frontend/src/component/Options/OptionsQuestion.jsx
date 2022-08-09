// ask the user to choose whether they would like to see video or guide
import React from "react";
import './Options.css';
function OptionsQuestion(props) {
  const data = [
    {
      text: "Videos",
      handler: props.actionProvider.handleVideos,
      id: 1
    },
    {
      text: "Guides",
      handler: props.actionProvider.handleGuides,
      id: 2
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
export default OptionsQuestion;
