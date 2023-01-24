import React, { useEffect, useState, useRef } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
function Chat({ socket, username, room }) {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messageList, setMessageList] = useState([]);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (currentMsg !== "") {
      const messageData = {
        room,
        author: username,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMsg("");
    }
  };
  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList([...messageList, data]);
    });
    username && room && chatRef.current.focus();
  }, [socket, messageList, username, room]);
  return (
    <div className="container">
      <div className="chat-header">
        <span>Live chat</span>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((chatData, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === chatData.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">{chatData.message}</div>
                  <div className="message-meta">
                    <span>{chatData.author}</span>
                    <span>{chatData.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          ref={chatRef}
          className="chat-input"
          value={currentMsg}
          type="text"
          placeholder="Chat...."
          onChange={(event) => {
            setCurrentMsg(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button className="chat-btn" onClick={sendMessage}>
          &#9658;
        </button>
      </div>
    </div>
  );
}

export default Chat;
