import './App.css'
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const nowRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [loader, setLoader] = useState(false);
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const storedResponse = localStorage.getItem("chatHistory");
    if (storedResponse) {
      setResponse(JSON.parse(storedResponse)); 
    } else {
      setResponse(["Hello, I'm an AI created by JRAM. How can I help you?"]);
    }
  }, []);

  useEffect(() => {
    if (response.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(response));
    }
  }, [response]);

  const getAIResponse = async () => {
    if (!input.trim()) return;
    setInput("");
    setLoader(true);

    try {
      const res = await axios.post('https://jr-ai.onrender.com/api/gemini', {
        prompt: input,
      });

      setResponse(prev => [...prev, res.data.response]);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (error) {
      console.error(error);
      setResponse(prev => [...prev, "Error fetching response"]);
    }

    setLoader(false);
  };

  function nav() {
    if (nowRef.current) {
      nowRef.current.classList.toggle('navvy');
    }
  }

  function dark() {
    let a = document.getElementById('ball');
    let b = document.getElementById('nav');
    let navbutton = document.getElementById('nav-button');
    let darkbutton = document.getElementById('toggle');
    let mainbg = document.getElementById('content');

    mainbg.classList.toggle('dark');
    darkbutton.classList.toggle('dark');
    navbutton.classList.toggle('dark');
    b.classList.toggle('dark');
    a.classList.toggle('dark-ball');
  }

  function deletion(){
   setResponse(["Hello, I'm an AI created by JRAM. How can I help you?"]);
  }
  function del(){
    let dd = document.getElementById('db');
    dd.classList.toggle('db');
  }



  return (
    <div className="main-page">
      <div ref={nowRef} id='nav-bar' className="nav-bar">
        <ul>
          <li onClick={nav}>AI</li>
          <li><a href='https://portfolio-jram-18.netlify.app/#about'>CREATOR</a></li>
        </ul>
      </div>
      <nav id='nav'>
        <button id='nav-button' onClick={nav}><i className="fa-solid fa-bars"></i></button>
        <h1 onClick={del}>Jram AI</h1>
        <button onClick={deletion} id='delete'>Clear Chat</button>
        <div onClick={dark} id='toggle' className="dark-toggle">
          <div id='ball' className="ball"></div>
        </div>
      </nav>
      <div id='db' className="delete-bar">        <button onClick={deletion}>Clear Chat</button>
      </div>
      <div className="content">
        <div id='content' className="content-right">
          <div className="chat-box">
            <ul id='list'>
              {response.map((msg, index) => (
                <li key={index} className="ai-message">{msg}</li>
              ))}
              {loader && <div id='loader' className="loader"></div>}
              <div ref={messagesEndRef} />
            </ul>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's Up?"
          />
          <button onClick={getAIResponse}><i className="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  );
}

export default App;
