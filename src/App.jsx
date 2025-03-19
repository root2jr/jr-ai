import './App.css'
import { useRef, useState } from 'react';
import axios from 'axios';


function App() {
  const nowRef = useRef(null);
  const [input, setInput] = useState("");
  const [loader, setLoader] = useState(false);
  const [response, setResponse] = useState("Hello Im an AI created by JRAM. How can i help you?");

  
  const getAIResponse = async () => {
    setResponse('');
    setInput("");
    setLoader(true)
    try {
      const res = await axios.post('http://localhost:5000/api/gemini', {
        prompt:input,
      });

      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
      setResponse("Error fetching response");
    }
    setLoader(false);
  };

 let a = document.getElementById('nav-bar');
 function nav(){
  if(nowRef.current){
  nowRef.current.classList.toggle('navvy');
}
 }


  return (
    <div className="main-page">
      <div ref={nowRef} id='nav-bar' className="nav-bar">
        <ul>
          <li onClick={nav}>AI</li>
          <li><a href=''>CREATOR</a></li>
        </ul>

      </div>
      <nav>
        <button onClick={nav}><i class="fa-solid fa-bars"></i></button>
        <h1>Jram AI</h1>
      </nav>
      <div className="content">
        <div className="content-right">
          <ul id='list'>
            <li>{response}</li>
            {loader && <div className="loader"></div>}

          </ul>
          <input type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)} placeholder="What's Up?"></input>
          <button onClick={getAIResponse}><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  )
}

export default App
