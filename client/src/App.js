import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useState } from "react";
function App() {
  const [alert, setalert] = useState(null);
  const showalert = (message, type) => {
    setalert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setalert(null);
    }, 3000)
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showalert={showalert}/>}></Route>
              <Route exact path="/about" element={<About showalert={showalert}/>}></Route>
              <Route exact path="/login" element={<Login showalert={showalert}/>}></Route>
              <Route exact path="/signup" element={<Signup showalert={showalert}/>}></Route>
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
