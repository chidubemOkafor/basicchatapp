import './App.css';
import {useState} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Message from './pages/Message';
import Home from './pages/home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { accountData } from './context/contexts';

function App() {
  const [data, setData] = useState({})
  return (
    <div>
      <accountData.Provider value={{data, setData}}>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/message' element={<Message/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
          </Routes>
      </BrowserRouter>
      </accountData.Provider>
    </div>
  );
}

export default App;
