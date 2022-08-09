// ask user to make sure they want to book a meeting
import React from "react";
import './Options.css';
function OptionsMeeting(props) {
  const data = [
    {
      text: "Yes, sure",
      handler: props.actionProvider.handleMeetingTure,
      id: 1
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
export default OptionsMeeting;
