
import useSWR from 'swr'
import Enviroment from "../core"
import ForkControl from '../data/ForkControl';
import {Skeleton} from "@mui/material"
import ForkBranch from '../components/ForkBranch';
import { useContext, useState } from 'react';
import axios from 'axios';
import "../SmallApp.css"
import useCaseUnpackFork from '../useCases/useCaseUnpackFork';
import MyContext from '../context';
const fetcher = (url) =>axios.get(url)
  .then((res) => res.data);
export default function TreeFormat(props){
    const {auth} = useContext(MyContext)
    const {data,error,isLoading}= useSWR(Enviroment.BASE_URL+"/fork/",fetcher)
    const token = localStorage.getItem("token")
    const loggedIn = token!==null && token!=="null"
    const [index,setIndex]=useState(loggedIn?0:3)
    const Loading = ()=>{
    if(isLoading){
      return(<div><Skeleton variant='rounded' width={"100%"}/></div>)
    }
    if(error){
      return(<div>Error:{error.message}</div>)
    }
  }
    const greetings = ["Hi! Heard you want to be productive?",
    "Not sure where to start?",
    "Check in with yourself, everything requires focus...",
    "Ask yourself, what is the intensity of foucs you want to use low or high? Then we can flow"]
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
 const fork = useCaseUnpackFork(data)
    return(
      <div className='tree--format' >
      <div className='top'>
      
      {!auth?<div className='greetings'>
        {index==3?<h4>Mindfulness</h4>:null}
      <h2>
  {greetings[index]}
      
      </h2>
      <button className="button--next" onClick={()=>next()}>
      Next
        </button>
      </div>
      :<div></div>}
      </div>
      <div className='bottom'>
        {!fork?<Loading/>: <ul id="tree" >
      <ForkBranch defaultOpen={true} fork={fork}/>
      </ul>}
   
      </div>
      </div>)
  }
}




