
import useForkChildren from "../hooks/useForkChildren"
import {useState } from 'react';
import Enviroment from "../core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ForkControl from "../data/ForkControl";
import AddIcon from "@mui/icons-material/Add"
import CreateTaskForm from "./CreateTaskForm";
import {Dialog,Skeleton} from "@mui/material"
function ForkBranch({fork,defaultOpen}){
    const [active,setActive]=useState(defaultOpen?defaultOpen:false)
    const [open,setOpen]=useState(false)
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
            <li className='fork--branch'>
               <p className="branch--text add">Add Task</p> <span   onClick={openDialog}
                        className='branch--add'><AddIcon/></span></li>:null}
        </ul>:null}
        <Dialog open={open} onClose={()=>closeDialog()}>
          <CreateTaskForm/>
        </Dialog>
    </div>
      
    )
}
}
export default ForkBranch
