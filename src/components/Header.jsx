
import {Dialog} from "@mui/material"
import Enviroment from "../core"
import { useState ,useLayoutEffect,useContext} from "react"
import axios from "axios"
import MyContext from "../context"
const login = "login"
const signUp = "signup"
export default function Header(props){
    const [auth,setAuth] = useState(null)
    const {format,setFormat}=useContext(MyContext)
    const [authentication,setAuthentication] = useState(null)
      const onLogin = (e)=>{
        e.preventDefault()
        const body = {email: e.target.email.value,
          password: e.target.password.value}
          axios.post(Enviroment.BASE_URL + '/auth/login',body).then(response=>{
            const {data} = response
            const {token}=data
            setAuth(token)
            setAuthentication(null)
            localStorage.setItem("tokenTimestamp",JSON.stringify( Date.now()));
            localStorage.setItem('token',token)
          })
      }
      const checkAuth=()=>{
        const token =localStorage.getItem('token')
        if(token){
       
          axios.get(Enviroment.BASE_URL+"/auth/", { 
            headers: 
              { Authorization: "Bearer " + token,
             }
            }).then(res=>{
              
             
            if(res.status==200){
              setAuth(token)
              setAuthentication(null)
            }
           
          }).catch(err=>{
          if(err.response.status==401){
              localStorage.setItem('token',null)
              setAuth(null)
              setAuthentication(null)}
          }
          )
        }
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
          localStorage.setItem("tokenTimestamp",JSON.stringify(Date.now()));
          localStorage.setItem('token',token)
    
        })
      }
      
      const onLogOut = (e)=>{
        localStorage.setItem("token",null)
        localStorage.setItem("tokenTimestamp",null);
        setAuth(null)

      }
  
      useLayoutEffect(()=>{
        checkAuth()
      },[])
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
       {format? <button onClick={()=>setFormat(!format)}>
          Quizlet
        </button>:<button onClick={()=>setFormat(!format)}>Tree</button>}
        {auth?<div className="auth--buttons" ><button onClick={onLogOut} className="auth--button">Log Out</button></div>:<div className="auth--buttons"><button className="auth--button"onClick={()=>setAuthentication(signUp)}>Sign Up</button>
     <button className="auth--button"
     onClick={()=>setAuthentication(login)}>Log In</button></div>
     }  
    <Dialog style={{height:"fit-content"}}onClose={()=>{setAuthentication(null)}} open={Boolean(authentication)}>
     {authenticating()}
     </Dialog>

    </header>)
}