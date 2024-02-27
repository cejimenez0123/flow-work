
import { FormGroup,TextField,Checkbox} from '@mui/material';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import Enviroment from '../core';
function CreateTaskForm({parentFork,handleNew}){
    const token = localStorage.getItem("token")
    const loggedIn = token!==null&&token!=="null"
    const [name,setName]=useState("")
    const [date, setDate] = useState(dayjs(Date.now()));
    const [dueDate, setDueDate] = useState(false)
    const handleName = (e)=>{
        setName(e.currentTarget.value)
    }
    const createTask = ()=>{
       
        if(loggedIn){
     
        axios.post(Enviroment.BASE_URL + '/fork/',{
            parentFork:parentFork,
            task:name.toLowerCase(),
            dueDate: dueDate?date["$d"]:null,
            },
       {headers: {
            Authorization: 'Bearer ' + token
       }}).then(
            response=>{
                if(response.data){
                    console.log(response.data)
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
    return(<div className='create--div'>
            <FormGroup className='create--form'>
            
                <TextField label="Name" value={name} onChange={(e)=>handleName(e)}/>
                <label>Is there a due date<Checkbox checked={dueDate} onClick={()=>setDueDate(!dueDate)} /></label>
                {dueDate?
                <div className='date--picker'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker  value={date}
  onChange={(newValue) => setDate(newValue)}/>
                </LocalizationProvider> </div>:null
               }
                <button className="create--button"onClick={()=>createTask()}>Create</button>
            </FormGroup>
    </div>)
}
export default CreateTaskForm