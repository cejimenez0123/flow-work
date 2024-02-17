import { useEffect, useRef, useState } from "react"
import axios from "axios"
import Enviroment from "../core"
import useSWR from 'swr'
import ForkControl from "../data/ForkControl";
import {Skeleton} from "@mui/material"
const fetcher = (url, token) =>axios.get(url, { headers: { Authorization: "Bearer " + token } })
  .then((res) => res.data);

function Fork({root}){
    const [choice,setChoice]=useState(null)
    const [plus,setPlus]=useState(false)
    const [task,setTask]=useState("")
    const [url,setUrl]=useState("")
    const [taskName,setTaskName]=useState("")
    useEffect(()=>{
        if(localStorage.getItem("token")){
            if(root){
                setTaskName(capitalizedWord(root.task))
                if(root.userId){
                    setUrl(Enviroment.BASE_URL+`/fork/protected/children/${root.id}`)
                }else{
                    setUrl(Enviroment.BASE_URL+`/fork/children/${root.id}`)
                }
            }
        }
    },[])
    const [choicesVisible,setChoicesVisible]= useState(true)
    const { data,error,isLoading } = useSWR([url, localStorage.getItem("token")], ([url, token]) => fetcher(url,token))
    
    
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
        return(<div>Error:{error.message}</div>)
    }
    if(url.length<1||isLoading){
        return(<div><Skeleton height={"8em"} width={"20em"}/></div>)
    }

    const Choices = ()=>{
        return(
    <div  
    ><ul className="choices">
    {data.map(node=>{
        let choice= new ForkControl(node.name,[],node.id)
        return(<li key={node.id} className="  choice">
            <button onClick={()=>handleChoice(choice)}>{choice.task}</button>
        </li> 
        )
    })}</ul></div>)
    }


const TaskName=()=>{
    return<h6 className="task float-in">
                    Do you want to {taskName}:______?
                </h6>
}
const render = ()=><div >
<div >
<div >
<TaskName/>
</div>
</div>
<div  >
<Choices/>
</div>
{plus?
<div className="create">
    <input  value={task} 
            className="name"
            onChange={(e)=>handleChange(e)}
            type="text"/>
        <button onClick={createTask}
            >Create
            </button>
        </div>:<button onClick={handlePlus}>+</button>}
</div>
   return(<div className="fork">
       {choice? 
       <div >
            <Fork root={choice}/>
        </div>:
            render()
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