import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios"
import Enviroment from '../core';
export default function Choice({choice,handleChoice}){
    const [checked,setChecked]=useState(choice.completed)
    const [fork,setFork] = useState(choice)
    const deleteTask=()=>{

    }
    const updateTask=()=>{
        axios.put(Enviroment.BASE_URL+`/children/${choice.id}`).then(

        )
    }
    const CheckedInputs=()=>{
        if(fork && fork.userId && fork.userId !== Enviroment.ADMIN_UID)
        return checked?
            <div><Button ><DeleteIcon/></Button> <Button>Cancel</Button></div>:
            <div><Checkbox checked={checked} onClick={()=>setChecked(!checked)}/></div>
    }
    return(<li key={fork.id} className="choice">
    <button className='choice--button'
     onClick={()=>handleChoice(choice)}>{fork.name}</button>
    {/* <CheckedInputs/> */}
</li> )
}