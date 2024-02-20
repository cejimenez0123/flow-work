import { useEffect, useLayoutEffect, useState } from "react"
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
    const [choices,setChoices]=useState([])
    const [plus,setPlus]=useState(false)
    const [task,setTask]=useState("")
    const [url,setUrl]=useState((Enviroment.BASE_URL+`/fork/children/${root.id??"65ce6f093ed66e8a5da96c07"}`))
    const [taskName,setTaskName]=useState("")
    const [auth,setAuth]=useState(null)
    const [initial,setInitial]=useState(true)
    useLayoutEffect(()=>{
            if(root){
                setTaskName(capitalizedWord(root.name))
                changeUrl(root)
            }
            setInitial(false)
    },[])

    const changeUrl =(root)=>{
        if(localStorage.getItem("token")!=="null" && localStorage.getItem("token")!==null && 
        ((root.userId !== Enviroment.ADMIN_UID && !Enviroment.root_array.includes(root.id)
            ))){
            setAuth(false)
            setUrl(Enviroment.BASE_URL+`/fork/protected/children/${root.id}`)
        }else{
            setAuth(true)
            setUrl(Enviroment.BASE_URL+`/fork/children/${root.id??"65ce6f093ed66e8a5da96c07"}`)
        }
    }
  
    const { data,error,isLoading } = useSWR([url,localStorage.getItem("token")??""], ([url, token]) => fetcher(url,token))
    useEffect(()=>{
        if(data && data.length>0){
        setChoices(data)
        }
    },[data])
    
    const handleChoice = (forkItem)=>{
        setChoice(forkItem)
    }
  
    const handlePlus = ()=>{
        setPlus(true)
    }
    const Choices = ()=>{
       
        if(choices.length>0){
        return(
    <div  
    ><ul className={`choices`}>
    {choices.map(node=>{
        let choice= new ForkControl(    node.id,
                                        node.name,
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
                        Do you want to {taskName}:______?
                    </h6>
    }
    const createTask = ()=>{
        let token = localStorage.getItem("token")
       
        if(token){
     
        axios.post(Enviroment.BASE_URL + '/fork/',{
            parentFork:root,
            task:task.toLowerCase(),
            },
       {headers: {
            Authorization: 'Bearer ' + token
       }}).then(
            response=>{
            setChoices(prevState=>[response.data,...prevState])
             
            }
        ).catch(error=>{
       

        })
    }else{
        window.alert("No Token")
    }
    }
    const handleChange = (e)=>{
        e.preventDefault()
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
        return(<div><div className="loading"><Skeleton width={"100%"} height={"100%"}/></div></div>)
    }

    




   return(<div className="fork">
       {choice? 
       <div >
            <Fork root={choice}/>
        </div>:
            <div >
            <div >
            <div className={initial?"render":""}  >
            <TaskName/>
            </div>
            </div>
            <div className={initial?"render":""}  >
            <Choices/>
            </div>
            {(root && 
            ((root.userId !== Enviroment.ADMIN_UID)||
            (localStorage.getItem("token")!=="null" && Enviroment.root_array.includes(root.id))))?
                
               plus ?
        <div className="create">
            <input  value={task} 
                    className="name"
                    onChange={(e)=>handleChange(e)}
                    type="text"/>
                <button className="create--input" onClick={createTask}
                    >Create
                    </button>
                </div>:<button className="create--button" onClick={handlePlus}>+</button>
           :
           (root.userId!==Enviroment.ADMIN_UID||Enviroment.root_array.includes(root.id))?
                <div className="create--disabled">
                    <button className="create--button disabled"disabled>+</button>
                    <div className="disabled--div">
                    <h3 className="disabled--text">Sign In to Add Task</h3>
                    </div>
                </div>:<div></div>
             
            }
            </div>
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