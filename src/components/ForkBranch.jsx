
import useForkChildren from "../hooks/useForkChildren"
import {useEffect, useState ,useContext} from 'react';
import Enviroment from "../core"
import {Dialog,Skeleton,useMediaQuery,IconButton} from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ForkControl from "../data/ForkControl";
import AddIcon from "@mui/icons-material/Add"
import CreateTaskForm from "./CreateTaskForm";
import ClearIcon from "@mui/icons-material/Clear"
import InfoIcon from '@mui/icons-material/Info';
import TaskInfoForm from "./TaskInfoForm";
import MyContext from "../context";
import useCaseUnpackFork from "../useCases/useCaseUnpackFork";
function ForkBranch({fork,defaultOpen,removeRoot}){
    const [active,setActive]=useState(defaultOpen?defaultOpen:false)
    const [openDialog,setOpenDialog]=useState(false)
    const [openInfo,setOpenInfo]=useState(false)
    const {auth}=useContext(MyContext)
    const smallScreen = useMediaQuery('(max-width:800px)');
    const {choices,error,isLoading}= useForkChildren({fork})
    const [forkChoices,setForkChoices]=useState(choices)
    const addChoice=(data)=>{
        setOpenDialog(false)
        setForkChoices(prevState=>[data,...prevState])
    }
    useEffect(()=>{
      setForkChoices(choices)
    },[choices])
    const AddChoice = ()=>{
      // fork.userId !== Enviroment.ADMIN_UID && auth
      //   || (Enviroment.root_array.includes(fork.id)&&auth
      if(fork.userId == Enviroment.ADMIN_UID && !Enviroment.WORK_ARRAY.includes(fork.id)){
        return null
      }else{
      if(fork.userId !== Enviroment.ADMIN_UID){
        return (<li onClick={showDialog} 
          className='fork--branch add'><span   
        className='branch--add'><AddIcon/></span><p lassName={`branch--text `}>Add Task</p></li>)
      }else{
        if(!auth){
        return(<li onClick={showDialog}
         className='fork--branch add'> 
          <p  className="branch--text add">Sign Up to add task</p><span   
        className='branch--add'><AddIcon/></span></li>)
      }
      }}
    }
        
        
    
    if(isLoading){
        return(<div><Skeleton height={"5em"}/></div>)
      }
    if(error){
        return(<div className="branch--error"><h2>Error</h2>
        <p>{error.message}</p>
        </div>)
      }
      const handleOpen=()=>{
      
            setActive(!active)
        
      }
      const showDialog=()=>{
        if(auth){
          setOpenDialog(true)
        }else{
          window.alert("Please Log In")
        }
      }
      const removeTask = (node)=>{
        setOpenInfo(false)
        let state = forkChoices.filter(f=>f.id!==node.id)
        setForkChoices(state) 
      }

       
      const hideDialog=()=>{
        setOpenDialog(false)
      }
    if(fork){
      return(
     <div>
      <li style={fork.style}onClick={handleOpen} className={`fork--branch`}>
        <span className="fork--span" >
        <span className="caret" >
          {active?<ExpandMoreIcon/>:<ChevronRightIcon/>}
        </span>
        
        <p onClick={()=>setOpenInfo(true)} className={`branch--text `} >
          {fork.name}
          </p></span>
          </li> 
        <ul style={{display:active && Array.isArray(forkChoices)?"":"none"}}className='ul--branch'>
            {forkChoices.map(node=>{
              
                    let choice= useCaseUnpackFork(node)
                    
                return <ForkBranch key={node.id} fork={choice}  removeRoot={(root)=>removeTask(root)}/>
            })}
  
                        <AddChoice/>
       
        </ul>
        <Dialog fullScreen={smallScreen?true:false}open={openInfo} onClose={()=>setOpenInfo(false)}>
        <div>
              <IconButton onClick={()=>setOpenInfo(false)}>
              <ClearIcon/>
              </IconButton>
            </div>
            <TaskInfoForm fork={fork} removeTask={(root)=>removeRoot(root)}/>
        </Dialog>
        <Dialog fullScreen={smallScreen?true:false}  open={openDialog} onClose={hideDialog}>
            <div>
              <IconButton onClick={hideDialog}>
              <ClearIcon/>
              </IconButton>
            </div>
          <CreateTaskForm parentFork={fork} handleNew={(data)=>addChoice(data)}/>
        </Dialog>
    </div>
      
    )
}
}
export default ForkBranch
