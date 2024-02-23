
import useSWR from 'swr'
import Enviroment from "../core"
import ForkControl from '../data/ForkControl';
import ForkBranch from '../components/ForkBranch';
import { useState } from 'react';
import axios from 'axios';
import "../SmallApp.css"
const fetcher = (url) =>axios.get(url)
  .then((res) => res.data);
export default function TreeFormat(props){
    const {data,error,isLoading}= useSWR(Enviroment.BASE_URL+"/fork/",fetcher)
    const token = localStorage.getItem("token")
    const [index,setIndex]=useState(token!==null||token!=="null"?0:3)
  
    if(isLoading){
      return(<div>Loading...</div>)
    }
    if(error){
      return(<div>Error:{error.message}</div>)
    }
    const greetings = ["Hi! Heard you want to be productive?",
    "Not sure where to start?",
    "Check in with yourself, everything requires focus...",
    "Do you want to be use high energy focus or low energy focus?"]
    const next= ()=>{
      setIndex(prevState=>{
       let state=  prevState+1
        if(state < greetings.length){
            return state
        }else{

          return 3
        }
      })
   
    }
   
  if(data){
    const {id,name,dueDate,parentId,completed,userId} = data
    const fork = new ForkControl(id,name,dueDate,completed,userId,parentId,[])
    return(
      <div className='tree--format' >
      <div className='top'>
   
      <div className='greetings'>
        {index==3?<h4>Mindfulness</h4>:null}
      <h2>
  {greetings[index]}
      
      </h2>
      <button onClick={()=>next()}>
      Next
        </button>
      </div>
      </div>
      <div className='bottom'>
    <ul id="tree" >
      <ForkBranch defaultOpen={true} fork={fork}/>
      </ul>
      </div>
      </div>)
  }
}




