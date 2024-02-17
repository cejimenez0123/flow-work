
import {Dialog} from "@mui/material"
import Enviroment from "../core"
import { useState , useEffect} from "react"
const login = "login"
const signUp = "signup"
export default function Header(props){
    const [auth,setAuth] = useState(null)
    const [authentication,setAuthentication] = useState(null)
    useEffect(()=>{
        let token = localStorage.getItem("token")
        let tokenTimestamp = JSON.parse(localStorage.getItem("tokenTimestamp"))
        const currentTimestamp = Date.now();
        const threeHoursAgo = currentTimestamp - (3 * 60 * 60 * 1000);
        if (tokenTimestamp > threeHoursAgo) {
    
        if(token){
          
          setAuth(token)
          setAuthentication(null)
        }else{
          setAuth(null)
          setAuthentication(null)
        }
       
      }else{
          setAuth(null)
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
       
          localStorage.setItem("tokenTimestamp",JSON.stringify( Date.now()));
            localStorage.setItem('token',token)
          })
      }
      const onSignUp = (e)=>{
        e.preventDefault()
    
        const body = {email: e.target.email.value,
                      password: e.target.password.value}
        axios.post(Enviroment.BASE_URL + '/auth/register',body).then(response=>{
    
          const {data} = response
          const {token}=data
          setAuth(token)
          setAuthentication(null)
          localStorage.setItem("tokenTimestamp",JSON.stringify( Date.now()));
          localStorage.setItem('token',token)
    
        })
      }
      const authenticating = ()=>{
        switch(authentication){
          case login :{
              return <div className='auth'>
                <form onSubmit={(e)=>onLogin(e)}>
                    <input className='auth--input' type="text" name="email" placeholder="E mail"/>
                    <input className='auth--input'type="password" name="password" placeholder="Password"/>
                    <button type="submit">Log In</button>
                </form>
              </div>
          }
        case signUp:{
          
          return   <div className='auth' >
            <form onSubmit={(e)=>onSignUp(e)}>
                    <input className='auth--input' type="text" name="email" placeholder="E mail"/>
                    <input className='auth--input'type="password" name="password" placeholder="Password"/>
                    <button type="submit">Sign Up</button>
                </form>
              </div>
        } 
      default:{
        return <div></div>
      }  }
      }
    return(<header>
        <h2 className="Logo">FlowTree</h2>
        {auth?<div></div>:<div className="auth--buttons"><button className="auth--button"onClick={()=>setAuthentication(signUp)}>Sign Up</button>
     <button className="auth--button"onClick={()=>setAuthentication(login)}>Log In</button></div>
     }  
    <Dialog onClose={()=>{setAuthentication(null)}}open={authentication}>
     {authenticating()}
     </Dialog>

    </header>)
}