import { Link } from 'react-router-dom';
import { useContext, useEffect, useState ,useRef} from 'react';
import Enviroment from '../core';
import dayjs from 'dayjs';;
import axios from "axios"
import "../App.css"
import useCaseDeleteTask from '../useCases/useCaseDeleteTasks';
import useCaseUpdateFork from '../useCases/useCaseUpdateFork';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MyContext from '../context';
import Colorful from '@uiw/react-color-colorful';
import { hsvaToHex,hexToHsva } from '@uiw/color-convert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function TaskInfoForm({fork,removeTask,updateTask}){
    const token = localStorage.getItem("token")
    const ColorTypes ={
        BACKGROUND:"BACK",
        TEXT:"TEXT"
    }
    const loggedIn = token!==null&&token!=="null"
    const notAdmin = fork.userId!==null
    const {auth}=useContext(MyContext)
    const [name,setName]=useState(fork.name)
    const [subTasks,setSubTasks]=useState([])
    const [date, setDate] = useState(dayjs(fork.dueDate));
    const [dueDate, setDueDate] = useState(fork.dueDate!==null)
    const [completed,setCompleted]=useState(false)
    const [description,setDescription] = useState(fork.description??"")
    const [onMouseDown,setOnMouseDown] = useState(false)
    const [colorType,setColorType]=useState(ColorTypes.BACKGROUND)
    let backHex = { h: 360, s: 0, v: 100, a: 1 }
    const [backhsva, setBackHsva] = useState(fork.style !=null && fork.style.backgroundColor?fork.style.backgroundColor:backHex);
    let colorHex = { h: 360, s: 0, v: 0, a: 1 }
    const [colorHsva, setColorHsva] = useState(fork.style !=null && fork.style.color?fork.style.color:colorHex);
 
    const handleName = (e)=>{
        setName(e.currentTarget.value)
    }
    const handleDescription = (e)=>{
        setDescription(e.currentTarget.value)
    }
    useEffect(()=>{
        getTasksSubTasks()
    },[])
    const deleteTask = ()=>{
        let list = [...subTasks.map(task=>task.id),fork.id]
        const params = {
            list,
            fork
        }
       
        useCaseDeleteTask(params,result=>{
            
            removeTask(fork)})
    }

    const updateFork = ()=>{
        const params = {
            fork,
            name,
            dueDate:date,
            style:{backgroundColor: hsvaToHex(backhsva),color:hsvaToHex(colorHsva)},
            completed,
            description
        }
        useCaseUpdateFork(params,(result)=>{
           
        })
        updateTask(params.style)
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
    const today = new Date().toISOString().slice(0, 10);
    const handleOnMouseDown = (e)=>{
    
        if(loggedIn && notAdmin){
            setOnMouseDown(true)
        } 
     } 
     const [expandDate,setExpandDate]=useState(false)

     const [expandColor,setExpandColor]=useState(false)
    return(<div className='create--div rounded-3xl' >
            <form className=' px-4  py-6 form-control'>
            {!onMouseDown?
            <h3 className={`info--name text-xl mx-6 mb-4`} 
                onMouseOver={(e)=>handleOnMouseDown(e)}>
                    {name}
            </h3>   :
            <input  type="text" 
                    onChange={(e)=>handleName(e)}
                    className={
                    `input  
                    mb-4
                    mx-2
                    text-xl
                    bg-white 
                    border 
                    border-solid `} value= {name} label="Name" />}
                {fork.link!==null && fork.link.length>2?<Link className={`btn btn-info`} to={fork.link}>Dive in</Link>:null}
            {!onMouseDown?<p className='info--textarea mx-2' onMouseOver={(e)=>handleOnMouseDown(e)}> 
            {description}</p>:
            <textarea  value={description} 
            placeholder='Description'
            onChange={(e)=>handleDescription(e)}
             className={`textarea textarea-bordered mx-2 border-solid bg-white `}
              type="text"   />
           }
    
        {auth &&  notAdmin && dueDate?     <div className="collapse">
  <input type="checkbox" onClick={()=>setExpandDate(!expandDate)} /> 
  <div className="collapse-title text-xl font-medium" >
   <div className='flex flex-row '>{expandDate?<ExpandMoreIcon/>:
       <ChevronRightIcon/>}Due Date
        </div>
  </div>
  <div className="collapse-content"> 
 
            
            <div className='date--picker w-full'>
         
             <input className="border-solid input bg-white w-full" 
                    type="date"    
                    id="start" 
                    onChange={(e)=>setDate(e.target.value)}
                     name="trip-start" value={date} min={today}  />
</div>      
  </div>
</div>:null}
            
{notAdmin && auth ?   <div className="collapse">
  <input type="checkbox" onClick={()=>setExpandColor(!expandColor)} /> 
  <div className="collapse-title text-xl font-medium" >
   <div className='flex flex-row '>{expandColor?<ExpandMoreIcon/>:
      <ChevronRightIcon/>}Customize Tab
        </div>
  </div>
  <div className="collapse-content"> 

                <div>
                    <div>
                <div className='inline-flex w-full ph-4 mb-4 m-auto' >
                    <div className="bg-gray-300 
                                    text-shadow
                                    hover:bg-gray-400 
                                    text-gray-800 
                                    text-center 
                                    font-bold py-2 px-4 rounded-l w-1/2"
                     onClick={()=>setColorType(ColorTypes.BACKGROUND)} 
                    style={{backgroundColor:backhsva,
                        color:colorHsva,
                        borderBottom:`1px solid ${colorHsva}`
                    }}>
                       Background
                    </div>
                    <div
                    className='bg-gray-300 hover:bg-gray-400 
                    text-gray-800 font-bold py-2 px-4 text-shadow rounded-r text-center w-1/2 ' 
                    onClick={()=>setColorType(ColorTypes.TEXT)}
                    style={{backgroundColor:backhsva,
                            color:colorHsva,
                            borderBottom:`1px solid ${colorHsva}`
                    }}>
                       Text Color
                    </div>
                </div>
                <div className='w-64 m-auto'>
                {colorType==ColorTypes.BACKGROUND?
                  <Colorful
                  color={backhsva}
              
                  onChange={(color) => {
                   
                    setBackHsva({ ...backhsva, ...color.hsva })
                  
                    }  }
                />

                :
                <Colorful
                color={colorHsva}
            
                onChange={(color) => {
             
                    setColorHsva({ ...colorHsva, ...color.hsva })
                    console.log(colorHsva)

            }}/>}
                    </div>
                </div>
            </div>
        </div>
    </div>:null}

               
                    
                {auth && notAdmin?  <div className="flex flex-row mx-2 space-x-4">
                   
                    <div onClick={deleteTask} 
                    className='info--delete btn btn-error text-white' ><DeleteOutlineIcon/></div>
                     <div  
                    onClick={updateFork}className='w-[82%] text-shadow text-white mr-4 btn btn-info'>
                        Update
                    </div></div>
                 :null}
                  {notAdmin && auth?
                
                <div className='btn btn-accent mx-2 mt-4 text-white '>Done</div>
    :null}
                
            </form>

    </div>)
}
export default TaskInfoForm