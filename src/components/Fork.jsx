import { useLayoutEffect, useState } from "react"
import axios from "axios"
import Enviroment from "../core"
import useSWR from 'swr'
import ForkControl from "../data/ForkControl";
import {Skeleton} from "@mui/material"
import Choice from "./Choice";
const fetcher = (url, token) =>axios.get(url, { headers: { Authorization: "Bearer " + token } })
  .then((res) => res.data);

function Fork({root}){
    const [choice,setChoice]=useState(null)
    const [plus,setPlus]=useState(false)
    const [task,setTask]=useState("")
    const [url,setUrl]=useState((Enviroment.BASE_URL+`/fork/children/${root.id??"65ce6f093ed66e8a5da96c07"}`))
    const [taskName,setTaskName]=useState("")
    
    useLayoutEffect(()=>{
            if(root){
                setTaskName(capitalizedWord(root.name))
                changeUrl(root)
            }
    },[])

    const changeUrl =(root)=>{
    if(root.id!="65ce6f093ed66e8a5da96c07"){
        if(!root.userId!==Enviroment.ADMIN_UID){
            setUrl(Enviroment.BASE_URL+`/fork/protected/children/${root.id}`)
        }else{
            setUrl(Enviroment.BASE_URL+`/fork/children/${root.id??"65ce6f093ed66e8a5da96c07"}`)
        }
    }}
  
    const { data,error,isLoading } = useSWR([url,localStorage.getItem("token")??""], ([url, token]) => fetcher(url,token))
    
    
    const handleChoice = (forkItem)=>{
        setChoice(forkItem)
    }
  
    const handlePlus = ()=>{
        setPlus(true)
    }
    const createTask = ()=>{
        let token = localStorage.getItem("token")
        axios.post(Enviroment.BASE_URL + '/fork/',{
            fork:root,
            task:task,
            },
       {headers: {
            Authorization: 'Bearer ' + token
       }}).then(
            response=>{
               console.log(response)
            }
        ).catch(error=>{
            if(error.response && error.response.data.includes("jwt expired")){
                localStorage.setItem("token",null)
            }else{
                console.error(error)
            }

        })
    }
    const handleChange = (e)=>{
        setTask(e.currentTarget.value)
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
        return(<div><div className="loading">Loading...</div></div>)
    }

    const Choices = ()=>{
       
        if(data.length>0){
        return(
    <div  
    ><ul className={`choices`}>
    {data.map(node=>{
        let choice= new ForkControl(    node.id,
                                        node.name,
                                        node.dueDate,
                                        node.completed,
                                        node.userId,
                                        node.parentId,
                                        [])
        return <Choice choice={choice} handleChoice={(chosen)=>handleChoice(chosen)}/>
    })}</ul></div>)}else if(data.length==0){
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
                    Do you want to {taskName}:______?
                </h6>
}
const CreateInputs = ()=>{
    
        if(root && root.userId !== Enviroment.ADMIN_UID && localStorage.getItem("token")){
                return plus ?
        <div className="create">
            <input  value={task} 
                    className="name"
                    onChange={(e)=>handleChange(e)}
                    type="text"/>
                <button className="create--input" onClick={createTask}
                    >Create
                    </button>
                </div>:<button className="create--button" onClick={handlePlus}>+</button>
            }else{
                if(!Boolean(localStorage.getItem("token"))){
                return<div>
                    <button className="create--button disabled"disabled>+</button>
                </div>
                }
            }
            return <div></div>
        }
    
           
        
           
        

   



const ForkDiv = ()=><div className="render" >
<div >
<div >
<TaskName/>
</div>
</div>
<div  >
<Choices/>
</div>
<CreateInputs/>
</div>
   return(<div className="fork">
       {choice? 
       <div >
            <Fork root={choice}/>
        </div>:
            <ForkDiv/>
        }
   </div>)

}
function capitalizedWord(word){
const firstLetter = word.charAt(0)

const firstLetterCap = firstLetter.toUpperCase()

const remainingLetters = word.slice(1)

const capitalizedWord = firstLetterCap + remainingLetters
return capitalizedWord
}
export default Fork