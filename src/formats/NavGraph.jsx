import  React,{ useState ,useRef, useLayoutEffect,useContext} from 'react'
import '../App.css'
import "../SmallApp.css"
import ClearIcon from '@mui/icons-material/Clear';
import MyContext from '../context'
import TreeFormat from "./TreeFormat"
import {Navigate, useNavigate,Routes,Route} from "react-router-dom";
import { Router } from '../core'
import {Dialog, Menu,IconButton,Box,useMediaQuery,MenuItem,Button} from "@mui/material"
import User from '../data/User'
import HomeIcon from '@mui/icons-material/Home';
import Home from "./Home"
// import theme from '../theme'
import Enviroment from '../core';
import axios from "axios"
const login = "login"
const signUp = "signup"

export default function NavGraph({appRef}){
        const headerRef = useRef()
        const {auth,setAuth,setUser,style}=useContext(MyContext)
        const [authentication,setAuthentication] = useState(null)
        const [anchorEl, setAnchorEl] = useState(null);
        const [err,setErr]=useState(null);
        const navigate = useNavigate()
        const open = Boolean(anchorEl);
        const smallScreen = useMediaQuery('(max-width:900px)');
        const handleClose = () => {
          setAnchorEl(null);
        };
          const onLogin = (e)=>{
            e.preventDefault()
            const body = {email: e.target.email.value,
              password: e.target.password.value}
              axios.post(Enviroment.BASE_URL + '/auth/login',body).then(response=>{
                const {data} = response
                const {token}=data
                setAuth(token)
                setErr(null)
                setAuthentication(null)
            
                localStorage.setItem("tokenTimestamp",JSON.stringify( Date.now()));
                localStorage.setItem('token',token)
              }).catch(err=>{
                setErr(err.message)
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
                  setErr(null)
                 
                if(res.status==200){
                  setAuth(token)
                  getUser()
                  setAuthentication(null)
                }
              
              }).catch(err=>{
                  localStorage.setItem('token',null)
                  setAuth(null)
                  setAuthentication(null)}
               
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
        
            }).catch(err=>{
              window.alert(err.message)
            })
          }
          const getUser = ()=>{
            const token =localStorage.getItem('token')
            axios.get(Enviroment.BASE_URL + "/auth/user",{headers: {
              Authorization: 'Bearer ' + token
            }}).then(response=>{
              setUser(response.data.user)
            }).catch(err=>{
              console.error(err);
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
          const handleOpenNavMenu = (event) => {
            setAnchorEl(event.currentTarget);
          };
          const goToHome = ()=>{
            let str = Router.home.createRoute()
            navigate(str)
          } 
          const authenticating = ()=>{
            switch(authentication){
              case login :{
                  return <div className='auth'>
                    <form onSubmit={(e)=>onLogin(e)}>
                        <input className='auth--input border' type="text" name="email" placeholder="E mail"/>
                        <input className='auth--input border'type="password" name="password" placeholder="Password"/>
                        {Boolean(err)?<p>{err}</p>:null}
                        <button className="btn"type=" submit">Log In</button>
                    </form>
                  </div>
              }
            case signUp:{
              
              return   <div className='auth' >
                <form onSubmit={(e)=>onSignUp(e)}>
                        <input className='auth--input border' type="text" name="email" placeholder="E mail"/>
                        <input className='auth--input border'type="password" name="password" placeholder="Password"/>
                        <button className="btn"type="submit">Sign Up</button>
                    </form>
                  </div>
            } 
          default:{
            return <div></div>
          }  }
          }
          const goToBasePath =()=>{
            navigate(Router.base.createRoute())
          }
          const hideDialog =()=>setAuthentication(null)
console.log(style)
          return(
            <div>


<div ref={headerRef} 
style={{backgroundColor:style.primary,
        color:style.color}}
        className="navbar ">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl" >FlowTree</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
          {auth?
              <IconButton onClick={goToHome}>
                <HomeIcon  sx={{height: "1.5em",width:"1.5em"}}/>
              </IconButton>:null}
              
              <Button  color="inherit"onClick={()=>goToBasePath()}>Tree Format</Button>
            {auth?<Button onClick={()=>{onLogOut()}} color="inherit">Log Out</Button>:<div>
                  <Button       
                                aria-haspopup="true"
                                onClick={(e)=>handleOpenNavMenu(e)}
                                color="inherit"
                            >
                    Log In
                  </Button>
                  <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem 
                      onClick={()=>setAuthentication(signUp)}>Sign Up</MenuItem>
            <MenuItem 
                      onClick={()=>setAuthentication(login)}>Log In</MenuItem>
      
          </Menu></div>}

    </ul>
  </div>
</div>
          
            <Dialog  fullScreen={smallScreen?true:false} onClose={()=>hideDialog()} open={Boolean(authentication)}>
          <div>
            <IconButton onClick={()=>hideDialog()}>
              <ClearIcon/>
            </IconButton>
          </div>
          {authenticating()}
         </Dialog>
        
    <Routes>
      <Route  path={Router.base.createRoute()} 
      element={<TreeFormat appRef={appRef} />}/>
      <Route  path={"/flow-work/home/"} 
        element={
            <div>

            
        {auth?<Home 
            headerRef={headerRef}
            appRef={appRef}
       />:<Navigate to={Router.base.createRoute()}/>}
        </div>}/>
    </Routes>
    
    </div>)
}
