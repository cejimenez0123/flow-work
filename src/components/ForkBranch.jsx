
import useForkChildren from "../hooks/useForkChildren"
import {useEffect, useState ,useContext} from 'react';
import Enviroment from "../core"
import {Dialog,Skeleton,useMediaQuery,IconButton} from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from "@mui/icons-material/Add"
import CreateTaskForm from "./CreateTaskForm";
import ClearIcon from "@mui/icons-material/Clear"
import TaskInfoForm from "./TaskInfoForm";
import MyContext from "../context";
import useCaseUnpackFork from "../useCases/useCaseUnpackFork";
const PriorityColors={
  High:"#ef4444",
  Medium:"#f97316",
  Low:"#fbbf24"
}
function ForkBranch({fork,defaultOpen,removeRoot}){
    const [active,setActive]=useState(defaultOpen?defaultOpen:false)
    const [openDialog,setOpenDialog]=useState(false)
    const [openInfo,setOpenInfo]=useState(false)
    const {auth}=useContext(MyContext)
    const [style,setStyle]= useState(fork.style?fork.style:{backgroundColor: "#FFFFFF"})
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
   
      if(auth && !Enviroment.WORK_ARRAY.includes(fork.id)){
        return (<li onClick={showDialog} 
          className='fork--branch pt-4 pb-4 add'><span   
        className='branch--add'><AddIcon/></span><p className={`branch--text `}>Add Task</p></li>)
      }else{
        if(!Enviroment.WORK_ARRAY.includes(fork.id)&&!auth){
        return(<li onClick={showDialog}
         className='fork--branch add'> 
          <p  className="branch--text pt-4 pb-4 add">Sign up to add task</p><span   
        className='branch--add'></span></li>)
      }
      }
    }
        
        
    const updateTask = (style)=>{
      setStyle(style)
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
     let dueDateStr = ""
      let priorityColor = ""
    if(fork){
      if(fork.dueDate){
      const date = new Date(fork.dueDate);
       if(!isDaysAhead(date,7)){
          priorityColor = PriorityColors.High
        }else if(!isDaysAhead(date,14)){
          priorityColor = PriorityColors.Medium
        }else if(!isDaysAhead(date,30)){
          priorityColor = PriorityColors.Low
        }
     dueDateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      
  }


      return(
     <div>
      
      <li style={{backgroundColor:style.backgroundColor,borderLeft: !isDaysAhead(fork.dueDate,30)&&dueDateStr.length>2?`0.7rem solid ${priorityColor}`:""}}onClick={handleOpen} className={`pt-4 pb-4 fork--branch`}>
        
        <span className="fork--span" >
        <span className="caret" >
          {active? <ExpandMoreIcon >
      
    </ExpandMoreIcon>:<ChevronRightIcon />}
        </span>
        
        <p onClick={()=>setOpenInfo(true)} style={{color:fork.style && fork.style.color?fork.style.color:""}}
        className={`branch--text text-shadow flex flex-row text-2xl pr-4 tracking-wider `} >
         {dueDateStr}<span className={`${dueDateStr.length>2?"ml-4":""}`}> {fork.name?fork.name:"Untitled"}</span>
          </p></span>
          </li> 
          
        <ul style={{display:active && Array.isArray(forkChoices)?"":"none"}}className='ul--branch'>
            {forkChoices.map(node=>{
              
                    let choice= useCaseUnpackFork(node)
                    
                return <ForkBranch key={node.id} fork={choice}  removeRoot={(root)=>removeTask(root)}/>
            })}
  
                        <AddChoice/>
       
        </ul>
        <Dialog PaperProps={{ sx: { borderRadius: "50px" } }}
                fullScreen={smallScreen?true:false}
                open={openInfo} 
                onClose={()=>setOpenInfo(false)}>
      <div className="pt-4 px-2">
        <div  >
              <IconButton onClick={()=>setOpenInfo(false)}>
              <ClearIcon/>
              </IconButton>
            </div>
            <TaskInfoForm fork={fork} 
                          removeTask={(root)=>removeRoot(root)} updateTask={(style)=>updateTask(style)}/>
    </div>
        </Dialog>
        
        <Dialog 
        PaperProps={{ sx: { borderRadius: smallScreen?"": "50px" } }}
            fullScreen={smallScreen?true:false}  
            open={openDialog} onClose={hideDialog}>
               <div className="pt-4 px-2">
            <div>
              <IconButton onClick={hideDialog}>
              <ClearIcon/>
              </IconButton>
            </div>
          <CreateTaskForm parentFork={fork} handleNew={(data)=>addChoice(data)}/>
          </div>
        </Dialog>
       
    </div>
      
    )
}
}
function isDaysAhead(dateTime,date) {
  const futureDate = new Date(dateTime);
  const today = new Date();
  const diffInMs = futureDate.getTime() - today.getTime();
   const daysInMs = date * 24 * 60 * 60 * 1000;
  return Math.abs(diffInMs) >= daysInMs;
}

export default ForkBranch
