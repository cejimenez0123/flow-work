
import { FormGroup,TextField,Button,Checkbox,FormControlLabel,IconButton} from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useContext, useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Enviroment from '../core';
import dayjs from 'dayjs';;
import axios from "axios"
import "../App.css"
import useCaseDeleteTask from '../useCases/useCaseDeleteTasks';
import useCaseUpdateFork from '../useCases/useCaseUpdateFork';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MyContext from '../context';
function TaskInfoForm({fork,removeTask,updateTask}){
    const token = localStorage.getItem("token")
    const loggedIn = token!==null&&token!=="null"
    const notAdmin = fork.userId!==Enviroment.ADMIN_UID
    const {auth}=useContext(MyContext)
    const [name,setName]=useState(fork.name)
    const [subTasks,setSubTasks]=useState([])
    const [date, setDate] = useState(dayjs(fork.dueDate));
    const [dueDate, setDueDate] = useState(fork.dueDate!==null? true:false)
    const [completed,setCompleted]=useState(fork.completed)
    const [description,setDescription] = useState(fork.description??"")
    const [onMouseDown,setOnMouseDown] = useState(false)

    const handleName = (e)=>{
        setName(e.currentTarget.value)
    }
    const handleDescription = (e)=>{
        setDescription(e.currentTarget.value)
    }
    useEffect(()=>{
        getTasksSubTasks()
    },[])
    useEffect(()=>{console.log(subTasks)},[subTasks])
    const deleteTask = ()=>{
        let list = [...subTasks.map(task=>task.id),fork.id]
        const params = {
            list,
            fork
        }
        console.log(params)
       
        useCaseDeleteTask(params,result=>{
            console.log(result)
            removeTask(fork)})
    }
    const updateFork = ()=>{
        const params = {
            fork,
            name,
            dueDate:date,
            completed,
            description
        }
        useCaseUpdateFork(params,(result)=>{
            console.log(result)
        })
    }
    const getTasksSubTasks = ()=>{
            recursive(fork.id)
    }
    const recursive = (id)=>{
        axios.get(Enviroment.BASE_URL + `/fork/children/${id}/user`,
        { headers: { Authorization: "Bearer " + token }}).then(
            response=>{
                if(response.data){
                    setSubTasks(prevState=>[...prevState,...response.data])
                    response.data.forEach(a=>recursive(a.id))
                }      
            
            }
        )
           
           
    }
    const handleOnMouseDown = (e)=>{
        console.log(e.target)
        if(loggedIn && notAdmin){
            setOnMouseDown(true)
        } 
     }
      console.log(fork) 
    return(<div className='create--div'>
            <FormGroup className='create--form'>
            {!onMouseDown?<h3 className={`info--name`} onMouseOver={(e)=>handleOnMouseDown(e)}>
                {name}</h3>:<TextField onChange={(e)=>handleName(e)}  type="text" value= {name} label="Name" />}
            
            {!onMouseDown?<p className='info--textarea' onMouseOver={(e)=>handleOnMouseDown(e)}> 
            {description}</p>:<textarea className='info--textarea'
            value={description} onChange={(e)=>handleDescription(e)}/>}
                {auth &&  notAdmin && dueDate?
                <div className='date--picker'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker  value={date}
  onChange={(newValue) => setDate(newValue)}/>
                </LocalizationProvider></div>:null
                }
                {notAdmin && auth?<FormControlLabel  
                    control={<Checkbox value={completed} 
                    onChange={()=>setCompleted(!completed)}/>} 
                    label="Completed" />:null}
                {auth && notAdmin?  <div className='info--buttons'>
                    <Button onClick={updateFork}className='info--update'>
                        Update
                    </Button>
                    <Button onClick={deleteTask} 
                    className='info--delete' style={{borderRadius:"1em",backgroundColor:"maroon"}}><DeleteOutlineIcon/></Button></div>
                 :null}
            </FormGroup>

    </div>)
}
export default TaskInfoForm