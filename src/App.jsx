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
import { createTheme } from '@mui/material/styles';


function App() {
  const appRef = useRef()
  
  const [choices,setChoices] = useState([])

  const [format,setFormat] = useState(true)
  const [auth,setAuth] = useState(null)
  const [user,setUser] = useState(new User(null,null,null))
  const theme = createTheme({
    palette: {
        primary:{
            main: "#3D687A",
            
            background:"#E0FFF9"
        },
        secondary:{
            main:"#60FFB6"
        }
    }
});
  if(!user.isNull && user.style){
    theme = createTheme({palette:{ 
      primary: user.style.primary,
      background: user.style.backgroundColor,
      contrastText: user.style.color
    }})
  }


  return (
      <div ref={appRef} className='App'>
     
        <MyContext.Provider value={{user,setUser,auth,setAuth,choices,setChoices,format,setFormat}}>
    <ThemeProvider theme={theme}>
        <NavGraph appRef={appRef} theme={/>
       
          </ThemeProvider>
     </MyContext.Provider>
    
    </div>
  )
}

export default App
         