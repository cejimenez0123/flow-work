import  React,{ useState ,useRef, useEffect, forwardRef } from 'react'
import './App.css'
import "./SmallApp.css"
import MyContext from './context'
import Header from './components/Header'
import TreeFormat from './formats/TreeFormat'
import { Routes,Route} from "react-router-dom";
import { Router } from './core'
import { ThemeProvider } from '@mui/material/styles';
import User from './data/User'
import Home from "./formats/Home"
import NavGraph from './formats/NavGraph'



function App() {
  const appRef = useRef()
  
  const [choices,setChoices] = useState([])

  const [format,setFormat] = useState(true)
  const [auth,setAuth] = useState(null)
  const [user,setUser] = useState(new User(null,null,null))
  const [style,setStyle] = useState(user.style? user.style:{backgroundColor
    :"#3d687a",
    color:"#3d687a",
    primary:"#2e8cff"})
useEffect(()=>{
  setStyle(user.style? user.style:{backgroundColor
    :"#3d687a",
    color:"#3d687a",
    primary:"#2e8cff"})
},[user])



  return (
      <div ref={appRef} style={{backgroundColor:style.backgroundColor}} className='App'>
     
        <MyContext.Provider value={{  style,
                                      setStyle,
                                      user,
                                      setUser,
                                      auth,
                                      setAuth,
                                      choices,
                                      setChoices,
                                      format,
                                      setFormat}}>

        <NavGraph appRef={appRef} />
       
        
     </MyContext.Provider>
    
    </div>
  )
}

export default App
         