import { useEffect, useLayoutEffect, useState } from "react"
import axios from "axios"
import Enviroment from "../core"
import useSWR from 'swr'
import ForkControl from "../data/ForkControl";
import {Skeleton,Dialog,IconButton,useMediaQuery} from "@mui/material"
import Choice from "./Choice";
import CreateTaskForm from "./CreateTaskForm";
import ClearIcon from '@mui/icons-material/Clear';
const fetcher = (url, token) =>axios.get(url, { headers: { Authorization: "Bearer " + token } })
  .then((res) => res.data);

export default function Fork({root}){
    const [choice,setChoice]=useState(null)
    const [choices,setChoices]=useState([])
    const smallScreen = useMediaQuery('(max-width:900px)');
    const [openDialog,setOpenDialog]=useState(false)
    const loggedIn = localStorage.getItem("token")!==null && localStorage.getItem("token")!=="null"
    const [url,setUrl]=useState((Enviroment.BASE_URL+`/fork/children/${root.id??"65ce6f093ed66e8a5da96c07"}`))
    const [taskName,setTaskName]=useState("")
    const [initial,setInitial]=useState(true)
    useLayoutEffect(()=>{
            if(root){
                setTaskName(root.name)
                changeUrl(root)
            }
            setInitial(false)
    },[])

    const changeUrl =(root)=>{
        if(localStorage.getItem("token")!=="null" && localStorage.getItem("token")!==null && 
        ((root.userId !== Enviroment.ADMIN_UID && !Enviroment.root_array.includes(root.id)
            ))){
            
            setUrl(Enviroment.BASE_URL+`/fork/protected/children/${root.id}`)
        }else{
          
            setUrl(Enviroment.BASE_URL+`/fork/children/${root.id??"65ce6f093ed66e8a5da96c07"}`)
        }
    }

    const { data,error,isLoading } = useSWR([url,localStorage.getItem("token")??""], ([url, token]) => fetcher(url,token))
    useEffect(()=>{
        if(data && data.length>0){
        setChoices(data)
        }
    },[data])
    const addChoice =(data)=>{
        setChoices(prevState=>[data,...prevState])
    }
    const handleChoice = (forkItem)=>{
        setChoice(forkItem)
    }
  
    const Choices = ()=>{
       
        if(choices.length>0){
        return(
    <div  
    ><ul >
    {choices.map(node=>{
        let choice= new ForkControl(    node.id,
                                        node.name,
                                        node.description,
                                        node.dueDate,
                                        node.completed,
                                        node.userId,
                                        node.parentId,
                                        [])
        return <Choice key={node.id}choice={choice} handleChoice={(chosen)=>handleChoice(chosen)}/>
    })}</ul></div>)}else if(choices.length==0){
        return(<div className="best-self">
            <h3>Go be your best self</h3>
                <h3>OR</h3>
            <h3>Add tasks below so you can start</h3>
        </div>)

    }else if(!Boolean(localStorage.getItem("token"))){
        return(<div className="call-to-action">
            <h3>Sign Up! Become productive</h3>
            <h4>You can add tasks with + but you need to sign up</h4>
        </div>)
    }

}
    const TaskName=()=>{
        return<h6 className="task">
                        {phraseAsQuestion(taskName)}
                    </h6>
    }
 
    const showDialog =()=>{
        setOpenDialog(true)
    }
    const hideDialog =()=>{
        setOpenDialog(false)
    }
    if(error){
     
        if(error.response.data.includes("jwt expired")){
            return <div>
               <h2> Sign In for more</h2>
            </div>
        }
        
        return(<div>Error:{error.message}</div>)
    }
    if(url.length<1||isLoading){
        return(<div><div className="loading"><Skeleton width={"100%"} height={"100%"}/></div></div>)
    }

    const AddButton =()=>{
    if(root && ((root.userId !== Enviroment.ADMIN_UID)||(loggedIn ))){
           return <div className="button--div"><button className="add--button" onClick={showDialog}>+</button></div>
        }else{
       if(root.userId!==Enviroment.ADMIN_UID||Enviroment.root_array.includes(root.id)){
            return<div className="create--disabled">
                <button className="add--button disabled"disabled>+</button>
                <div className="disabled--div">
                <h3 className="disabled--text">Sign In to Add Task</h3>
                </div>
            </div>}else{return null
            
        }
    } 
        }




   return(<div >
       {choice? 
       <div >
            <Fork root={choice}/>
        </div>:
            <div >
            <div className="top" >
            <div className={initial?"render":""}  >
            <TaskName/>
            </div>
            </div>
            <div className="bottom">
            <div className={"choices "+initial?"render":""}  >
            <Choices/>
            </div>
            <AddButton/>
            </div>
 
            <Dialog fullScreen={smallScreen?true:false}open={openDialog} onClose={hideDialog}>
                <div>
                    <IconButton onClick={hideDialog}>
                        <ClearIcon/>
                    </IconButton>
                </div>
                <CreateTaskForm parentFork={root} handleNew={(data)=>addChoice(data)}/>
            </Dialog>
            </div>
        }
   </div>)

}

function phraseAsQuestion(task){
    const array = ["focus"]
    const phrase = ["high","low"]
    const verbs = ["read"]
    if(array.includes(task.toLowerCase())){
        return `What level of ${task} energy do you want to use?`
    }else if(phrase.includes(task.toLowerCase)){
        return `What do you want to use your ${task} energy on?`
    }else if(verbs.includes(task.toLowerCase())){
        return `What kind of ${task}ing do you want to do?`
    }else{
        return `What form of ${task} do you want to do?`
    }


}