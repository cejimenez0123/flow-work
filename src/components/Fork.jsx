import { useRef, useState } from "react"
import axios from "axios"
import Enviroment from "../core"



function Fork({fork}){
    const [next,setNext]=useState(false)
    const [choice,setChoice]=useState(null)
    const [plus,setPlus]=useState(false)
    const [task,setTask]=useState("")
  
    const hanldeOnClick = (forkItem)=>{
        setChoice(forkItem)
    }
    const taskName = capitalizedWord(fork.task)
    const handlePlus = ()=>{
        setPlus(true)
    }
    const createTask = ()=>{
        let token = localStorage.getItem("token")
        axios.post(Enviroment.BASE_URL + '/fork/fork',{task:task,type: fork.task},
       {headers: {
            Authorization: 'Bearer ' + token
       }}).then(
            response=>{
                console.log(response)
            }
        )
    }
    const handleChange = (e)=>{
        console.log(e.currentTarget.value)
        setTask(e.currentTarget.value)
    }
   return(<div>
        {choice?<div>
            <Fork fork={choice}/>
        </div>:
        
        <div className="choice"><div className="task">{taskName}</div>
        <ul>
            {fork.choices.map(choice=>{
                
                return(<div>
                    <button onClick={()=>hanldeOnClick(choice)}>{choice.task}</button>
                </div>)
            })}
            {plus?<div><input value={task} onChange={(e)=>handleChange(e)}type="text"/><button onClick={createTask} >Create</button></div>:<button onClick={handlePlus}>+</button>}
        </ul>
        </div>}
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