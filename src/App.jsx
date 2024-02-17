import { useEffect, useLayoutEffect, useState } from 'react'
import axios from "axios"
import './App.css'
import Fork from './components/Fork'
import ForkControl from './data/ForkControl'
import tasks from './data/tasks'
import Enviroment from './core'
import MyContext from './context'
import Header from './components/Header'

function App() {
 
  const [start,setStart] = useState(false)
  
  const [rootFork,setRootFork] = useState(null)
  const [choices,setChoices] = useState([])
  const getTree = ()=>{
    let token = localStorage.getItem("token")
    if(token){
      axios.get(Enviroment.BASE_URL+"/fork/", {headers: {
        Authorization: 'Bearer ' + token
   }}).then((response)=>{
    const {createdAt,id,name,userId} = response.data;
      const fork = new ForkControl(name,[],id)
      setRootFork(fork)
      
       
      }).catch((error)=>{
        if(error.response && error.response.data.includes("jwt expired")){
          setAuth(null)
          setAuthentication(null)
        }else{
          console.log(error)
        }
      });

  }
  }
  
     const handleStart = ()=>{
        setStart(true)
     } 
     const startOver = ()=>{
      setStart(false)
     } 
  useEffect(()=>{

    getTree()
  },[])


  return (
      <div className='App'>
      <MyContext.Provider value={[choices,setChoices]}>
      <Header/>
      <main>
        <div className='main--buttons'>
     {start?<div>
      <Fork root={rootFork} />
      </div>:<button className='start--button' onClick={handleStart}>
      Start
     </button>}
     <div>
     <button className="restart"onClick={startOver}>Start Over</button>
     </div>
     </div>
     </main>
     </MyContext.Provider>
</div>
  )
}

export default App
