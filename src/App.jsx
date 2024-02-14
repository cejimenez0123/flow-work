import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'
import Fork from './components/Fork'
import ForkControl from './data/ForkControl'
import tasks from './data/tasks'
import Enviroment from './core'
let highRelax = tasks.high.relax.map(task=>new ForkControl(task,[]))
let lowRelax = tasks.low.relax.map(task=>new ForkControl(task,[]))
let highWork = tasks.high.work.map(task=>new ForkControl(task,[]))
let lowWork = tasks.low.work.map(task=>new ForkControl(task,[]))
const login = "login"
const signUp = "signup"
function App() {
  
  const [auth,setAuth] = useState(null)
  const [start,setStart] = useState(false)
  const [authentication,setAuthentication] = useState(null)
  const fork = new ForkControl("focus",[
  new ForkControl("low",[new ForkControl("work",lowWork),
                          new ForkControl("relax",lowRelax)]),
  new ForkControl("high",[new ForkControl("work",highWork),
                          new ForkControl("relax",highRelax)])                    
                        
                        
                        ])
     const handleStart = ()=>{
        setStart(true)
     } 
     const startOver = ()=>{
      setStart(false)
     } 
     
  const startProcess=()=>{
    return start?<div>
      <Fork fork={fork} />

      </div>:<button onClick={handleStart}>
      Start
     </button>
  }
  useEffect(()=>{
    let token = localStorage.getItem("token")
    if(token){
      setAuth(token)
      setAuthentication(null)
    }
  },[])
  const onLogin = (e)=>{
    e.preventDefault()
    console.log(e.target.email.value)
    const body = {email: e.target.email.value,
      password: e.target.password.value}
      axios.post(Enviroment.BASE_URL + '/auth/login',body).then(response=>{
        console.log(response)
        const {data} = response
        const {token}=data
        setAuth(token)
        setAuthentication(null)
        localStorage.setItem('token',token)
      })
  }
  const onSignUp = (e)=>{
    e.preventDefault()
    console.log(e.target.email.value)
    const body = {email: e.target.email.value,
                  password: e.target.password.value}
    axios.post(Enviroment.BASE_URL + '/auth/register',body).then(response=>{
      console.log(response)
      const {data} = response
      const {token}=data
      setAuth(token)
      setAuthentication(null)
      localStorage.setItem('token',token)
    })
  }
  const authenticating = ()=>{
    switch(authentication){
      case login :{
          return <div>
            <form onSubmit={(e)=>onLogin(e)}>
                <input type="text" name="email" placeholder="E mail"/>
                <input type="password" name="password" placeholder="Password"/>
                <button type="submit">Submit</button>
            </form>
          </div>
      }
    case signUp:{
      
      return   <div onSubmit={(e)=>onSignUp(e)}>
        <form>
                <input type="text" name="email" placeholder="E mail"/>
                <input type="password" name="password" placeholder="Password"/>
                <button type="submit">Submit</button>
            </form>
          </div>
    } 
  default:{
    return <div></div>
  }  }
  }
  return (
    <>
      <div>
     {auth?<div></div>:<div><button onClick={()=>setAuthentication(signUp)}>Sign Up</button>
     <button onClick={()=>setAuthentication(login)}>Log In</button></div>
     }
     {authenticating()}
     {startProcess()}
     <button onClick={startOver}>Start Over</button>
</div>
  
    </>
  )
}

export default App
