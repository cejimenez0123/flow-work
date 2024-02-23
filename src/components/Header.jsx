
import {Dialog, Menu,IconButton,Box,useMediaQuery,MenuItem,AppBar,Toolbar,Typography,Button} from "@mui/material"
import Enviroment from "../core"
import ClearIcon from '@mui/icons-material/Clear';
import { useState ,useLayoutEffect,useContext} from "react"
import axios from "axios"
import MyContext from "../context"


const login = "login"
const signUp = "signup"
export default function Header(props){
    const [auth,setAuth] = useState(null)
    const {format,setFormat}=useContext(MyContext)
    const [authentication,setAuthentication] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
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
      const handleOpenNavMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
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
      const hideDialog =()=>setAuthentication(null)
 
      return(
       
         <Box sx={{ flexGrow: 1 }}>
        <AppBar style={{backgroundColor:"#3D687A"}} position="static">
          <Toolbar>
           
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FlowTree
            </Typography>
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
          
            {format? <Button color="inherit"onClick={()=>setFormat(!format)}>
          Quizlet Format
        </Button>:<Button color="inherit"onClick={()=>setFormat(!format)}>Tree Format</Button>}
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
      )
}