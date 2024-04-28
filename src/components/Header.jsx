
import {Dialog, Menu,IconButton,Box,useMediaQuery,MenuItem,AppBar,Toolbar,Typography,Button} from "@mui/material"
import Enviroment from "../core"
import ClearIcon from '@mui/icons-material/Clear';
import { useState ,useLayoutEffect,useContext, useEffect} from "react"
import axios from "axios"
import MyContext from "../context"
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import { Router } from "../core";
const login = "login"
const signUp = "signup"
export default function Header(){
   
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
                    <input className='auth--input' type="text" name="email" placeholder="E mail"/>
                    <input className='auth--input'type="password" name="password" placeholder="Password"/>
                    {Boolean(err)?<p>{err}</p>:null}
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
      const goToBasePath =()=>{
        navigate(Router.base.createRoute())
      }
      const hideDialog =()=>setAuthentication(null)
      return(
       <div id="nav">
         <Box id="header" sx={{ flexGrow: 1 }}>
        <AppBar   position="static">
          <Toolbar style={{backgroundColor:style.primary}}>
           
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FlowTree
            </Typography>
          {auth?
          <IconButton onClick={goToHome}>
            <HomeIcon  sx={{height: "1.5em",width:"1.5em"}}/>
          </IconButton>:null}
          
          <Button color="inherit"onClick={()=>goToBasePath()}>Tree Format</Button>
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
        <MenuItem onClick={()=>setAuthentication(signUp)}>Sign Up</MenuItem>
        <MenuItem onClick={()=>setAuthentication(login)}>Log In</MenuItem>
  
      </Menu></div>}
          </Toolbar>
        </AppBar>
        <Dialog  fullScreen={smallScreen?true:false} onClose={()=>hideDialog()} open={Boolean(authentication)}>
      <div>
        <IconButton onClick={()=>hideDialog()}>
          <ClearIcon/>
        </IconButton>
      </div>
      {authenticating()}
     </Dialog>
      </Box>
      </div>
      )
}