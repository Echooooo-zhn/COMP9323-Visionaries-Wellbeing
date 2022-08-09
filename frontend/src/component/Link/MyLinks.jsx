// return a link to click with for book meeting in chatbot
import React from "react";
import { useNavigate } from 'react-router-dom';
function MyLinks(props) {
  const navigate = useNavigate();
  return (
    <button onClick={() => { navigate(props.url) }}>
      Click me!
    </button>
  );
}
export default MyLinks;