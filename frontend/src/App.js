import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:8000");
function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  return (
    <>
      {!showChat && (
        <div className="container">
          <form class="form">
            <h3>Welcome to our Chat box</h3>
            <input
              className="input"
              type="text"
              placeholder="Enter name..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              className="input"
              type="text"
              placeholder="Room id...."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button className="btn" onClick={joinRoom}>
              Join a room
            </button>
          </form>
        </div>
      )}
      {showChat && <Chat socket={socket} username={username} room={room} />}
    </>
  );
}

export default App;
