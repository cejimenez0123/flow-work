import  React,{ useState ,useRef, useEffect, forwardRef } from 'react'
import './App.css'
import "./SmallApp.css"
import MyContext from './context'
import User from './data/User'
import NavGraph from './formats/NavGraph'



function App() {
  const appRef = useRef()
  
  const [choices,setChoices] = useState([])

  const [format,setFormat] = useState(true)
  const [auth,setAuth] = useState(null)
  const [user,setUser] = useState(new User(null,null,null))
  const [style,setStyle] = useState(user.style? user.style:{backgroundColor
    :"#E0FFF9",
    color:"#FFFFFF",
    primary:"#3D687A"})
useEffect(()=>{
  setStyle(user.style? user.style:{backgroundColor
    :"#E0FFF9",
    color:"#FFFFFF",
    primary:"#3D687A"})
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
         