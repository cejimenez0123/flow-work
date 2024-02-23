
import { FormGroup,TextField,Checkbox} from '@mui/material';
import { useState } from 'react';
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


function CreateTaskForm({parentFork}){

    const [name,setName]=useState("")
    const [date, setDate] = useState(dayjs(Date.now()));
    const [dueDate, setDueDate] = useState(false)
    const handleName = (e)=>{
        setName(e.currentTarget.value)
    }
    const createTask = ()=>{
console.log(date["$d"])
console.log(name)
    //     let token = localStorage.getItem("token")
       
    //     if(token){
     
    //     axios.post(Enviroment.BASE_URL + '/fork/',{
    //         parentFork:root,
    //         task:task.toLowerCase(),
    //         },
    //    {headers: {
    //         Authorization: 'Bearer ' + token
    //    }}).then(
    //         response=>{
    //         setChoices(prevState=>[response.data,...prevState])
             
    //         }
    //     ).catch(error=>{
       

    //     })
    // }else{
    //     window.alert("No Token")
    // }
    }
    return(<div className='create--div'>
            <FormGroup className='create--form'>
            
                <TextField label="Name" value={name} onChange={(e)=>handleName(e)}/>
                <label>Is there a due date<Checkbox checked={dueDate} onClick={()=>setDueDate(!dueDate)} /></label>
                {dueDate?
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker  value={date}
  onChange={(newValue) => setDate(newValue)}/>
                </LocalizationProvider>:null
                }
                <button onClick={()=>createTask()}>Create</button>
            </FormGroup>
    </div>)
}
export default CreateTaskForm