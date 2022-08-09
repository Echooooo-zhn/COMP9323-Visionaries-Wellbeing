// The components of chatbot avatar
import React from "react";
import "./BotAvatar.css";
import botavatar from "../../assets/bot.png";
function BotAvatar() {
  return <img src={botavatar} className="my-avatar" />;
}
export default BotAvatar;
