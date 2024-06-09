import {Checkbox,Button} from '@mui/material';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios"
import Enviroment from '../core';
export default function Choice({choice,handleChoice}){
    const [checked,setChecked]=useState(choice.completed)
    const [fork,setFork] = useState(choice)
    const deleteTask=()=>{

    }
  
    const CheckedInputs=()=>{
        if(fork && fork.userId && fork.userId !== null)
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