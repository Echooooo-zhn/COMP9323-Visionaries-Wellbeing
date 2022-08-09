// ask the user which filed of meeting they want to add
import React from "react";
import './Options.css';
function OptionsMeetingTure(props) {
  const data = [
    {
      text: "Mental Health",
      handler: props.actionProvider.handleMeetingMentalHealth,
      id: 1
    },
    {
      text: "Covid 19",
      handler: props.actionProvider.handleMeetingCovid19,
      id: 2
    },
    {
      text: "Staying at home",
      handler: props.actionProvider.handleMeetingStayingAtHome,
      id: 3
    },
    {
      text: "Career advice",
      handler: props.actionProvider.handleMeetingCareerAdvice,
      id: 4
    },
    {
      text: "Vaccation",
      handler: props.actionProvider.handleMeetingVaccation,
      id: 5
    },

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
export default OptionsMeetingTure;
