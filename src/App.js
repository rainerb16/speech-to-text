import { useState, useEffect } from "react";
import "./App.css";

const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-CA" || "en-US";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState(null);
  const [savedTexts, setSavedTexts] = useState([]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue...");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("mic stopped...");
      };
    }
    mic.onstart = () => {
      console.log("mic is on...");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setText(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveText = () => {
    setSavedTexts([savedTexts, text]);
    setText("");
  };

  return (
    <>
      <h1 className="main-title">Speech to Text</h1>
      <div className="main-container">
        <div className="wrapper">
          <h2 className="title">You said:</h2>
          <div className="text-container">
            <div className="listening">
              {!isListening ? (
                <span className="emoji">🔇</span>
              ) : (
                <span className="emoji">🎤 Listening...</span>
              )}
            </div>
            <p>{text}</p>
          </div>
          <div className="btn-wrapper">
            <span className="save-btn" onClick={handleSaveText} disable={!text}>
              Save Text
            </span>
            <span
              className="save-btn"
              onClick={() => setIsListening((prevState) => !prevState)}
            >
              Start / Stop
            </span>
          </div>
        </div>
        <div className="wrapper">
          <h2 className="title">Your texts:</h2>
          <div className="text-container">
            {savedTexts.map((item, i) => {
              return <p key={i}>{item}</p>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
