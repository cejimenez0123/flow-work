
import { useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import Enviroment from '../core';
import useCaseUploadFile from '../useCases/useCaseUploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
function CreateTaskForm({parentFork,handleNew}){
    const token = localStorage.getItem("token")
    const loggedIn = token!==null&&token!=="null"
    const [name,setName]=useState("")
    const [date, setDate] = useState(dayjs(Date.now()));
    const [link,setLink]=useState("")
    const [dueDate, setDueDate] = useState(false)
    const [expandFile,setExpandFile] =useState(false)
    const [description,setDescription] = useState("")
    const handleName = (e)=>{
        setName(e.currentTarget.value)
    }
    const handleDescription = (e)=>{
        setDescription(e.currentTarget.value)
    }
    const createTask = (e)=>{
        e.preventDefault()
        if(loggedIn){
     
        axios.post(Enviroment.BASE_URL + '/fork',{
            parentFork:parentFork,
            task:name.toLowerCase(),
            dueDate: dueDate?date:null,
            link:link
            },
       {headers: {
            Authorization: 'Bearer ' + token
       }}).then(
            response=>{
                if(response.data){
                
                    handleNew(response.data);
                }
             
            }
        ).catch(error=>{
       
            console.error(error)
        })
    }else{
        window.alert("No Token")
    }  
    }
    const handleLink = (e)=>{
        setLink(e.target.value)
    }
    const handleFile = (e)=>{
        let file = e.target.files[0]
        console.log(file)
        useCaseUploadFile({file:file},(url)=>{
            console.log("url",url)
        })
       
    }
    const handleDate = (e)=>{
        console.log(e.target.value)
        setDate(e.target.value)
    }
    const today = new Date().toISOString().slice(0, 10);
    return(<div className='create--div'>
            <form className='create--form form-control'>
            
                <input type="text" placeholder="Task Name" className='input mb-4 bg-white border-solid border mx-4 border-cyan-700' label="Name" value={name} onChange={(e)=>handleName(e)}/>
                <textarea  value={description} 
            onChange={(e)=>handleDescription(e)}
             className={`textarea textarea-bordered  bg-white `}
              type="text"   />
                <label className='align-middle text-xl w-full mx-4 w-1/2'>Is there a due date
                <input type="checkbox" className='ml-4 checkbox' checked={dueDate} onClick={()=>setDueDate(!dueDate)} /></label>
                {dueDate?
                <div className='date--picker'>
                   <div className='date--picker w-full'>
         
         <input className="border-solid border-cyan-700  mb-4 input bg-white w-full" 
                type="date"    
                id="start" 
                onChange={(e)=>handleDate(e)}
                 name="trip-start" value={date} min={today}  />
</div> </div>:null
               }
               <div className="collapse">
  <input type="checkbox" onClick={()=>setExpandFile(!expandFile)} /> 
  <div className="collapse-title text-xl font-medium" >
   <div className='flex flex-row '>{expandFile?
   //<div className='up-triangle my-auto mr-4'/>
   <ExpandMoreIcon/>
  :
  <ChevronRightIcon/>
        // <div
        // className='down-triangle my-auto mr-4'
        //                             />
                                    }Add File or Link
        </div>
  </div>
  <div className="collapse-content"> 
  <input type='text' placeholder='link' onChange={(e)=>handleLink(e)}className='input bg-white w-full border border-solid border-cyan-700'/>
  <span class="sr-only">Add File </span>
    <input type="file" onChange={e=>handleFile(e)}class="block mt-4 w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-cyan-100 file:text-cyan-700
      hover:file:bg-violet-100
    "/>
  
  </div>
</div>
                <button className="create--button"onClick={(e)=>createTask(e)}>Create</button>
            </form>
    </div>)
}
export default CreateTaskForm