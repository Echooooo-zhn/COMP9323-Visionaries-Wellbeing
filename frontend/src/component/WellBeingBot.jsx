/*
 * @Author: Echooooo-zhn haonanZHONG17@outlook.com
 * @Date: 2022-08-04 03:27:10
 * @LastEditors: Echooooo-zhn haonanZHONG17@outlook.com
 * @LastEditTime: 2022-08-08 07:55:09
 * @FilePath: \Visionaries\frontend\src\component\WellBeingBot.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import Chatbot from "react-chatbot-kit";
import './WellBeingBot.css'
import config from "./configs/config.jsx";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";


// The button of chatbot.
const WellBeingBot = () => {
  const [search, setSearch] = useState('');
  return (
    <div >
      <div style={{ width: '400px' }}>
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
    </div >

  );
}
export default WellBeingBot;