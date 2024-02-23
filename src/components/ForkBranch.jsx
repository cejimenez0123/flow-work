
import useForkChildren from "../hooks/useForkChildren"
import {useState } from 'react';
import Enviroment from "../core"
import {Dialog,Skeleton,useMediaQuery,IconButton} from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ForkControl from "../data/ForkControl";
import AddIcon from "@mui/icons-material/Add"
import CreateTaskForm from "./CreateTaskForm";
import ClearIcon from "@mui/icons-material/Clear"
function ForkBranch({fork,defaultOpen}){
    const [active,setActive]=useState(defaultOpen?defaultOpen:false)
    const [open,setOpen]=useState(false)
    const smallScreen = useMediaQuery('(max-width:900px)');
    const token = localStorage.getItem('token')
    const loggedIn =token!==null && token!=="null"
    const {choices,error,isLoading}= useForkChildren({fork})
    if(isLoading){
        return(<div><Skeleton width={""}/></div>)
      }
      if(error){
        return(<div>Error</div>)
      }
      const handleOpen=()=>{
      
            setActive(!active)
        
      }
      const openDialog=()=>{
        setOpen(true)
      }
      const closeDialog=()=>{
        setOpen(false)
      }
    if(choices){
      return(
     <div>
      <li onClick={handleOpen} className={`fork--branch`}>
        <span className="fork--span" >
        <span className="caret" >
          {active?<ExpandMoreIcon/>:<ChevronRightIcon/>}
        </span>
        <p className={`branch--text `} >
          {fork.name}
          </p></span>
          </li> 
        {active && Array.isArray(choices)?
        <ul className='ul--branch'>
            {choices.map(node=>{
                    let choice= new ForkControl(    
                        node.id,
                        node.name,
                        node.dueDate,
                        node.completed,
                        node.userId,
                        node.parentId,
                        [])
                return <ForkBranch fork={choice}/>
            })}
            {(fork.parentId===Enviroment.ADMIN_UID || Enviroment.root_array.includes(fork.id))?
            <li onClick={()=>{

              if(loggedIn){
                openDialog()
              }else[
                window.alert("Please Log In")
              ]
            }} className='fork--branch'>
              {loggedIn?<p  className="branch--text add">Add Task</p>:
                        <p  className="branch--text add">Sign Up to add task</p>} <span   
                        className='branch--add'><AddIcon/></span></li>:null}
        </ul>:null}
        <Dialog fullScreen={smallScreen?true:false}  open={open} onClose={closeDialog}>
            <div>
              <IconButton onClick={closeDialog}>
              <ClearIcon/>
              </IconButton>
            </div>
          <CreateTaskForm/>
        </Dialog>
    </div>
      
    )
}
}
export default ForkBranch
