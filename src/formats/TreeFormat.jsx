
import useSWR from 'swr'
import Enviroment from "../core"
import ForkControl from '../data/ForkControl';
import {Skeleton} from "@mui/material"
import ForkBranch from '../components/ForkBranch';
import { useContext, useState ,useRef} from 'react';
import axios from 'axios';
import "../SmallApp.css"
import { hsvaToHex,hexToHsva} from '@uiw/color-convert';
import useCaseUnpackFork from '../useCases/useCaseUnpackFork';
import MyContext from '../context';
const fetcher = (url) =>axios.get(url)
  .then((res) => res.data);
export default function TreeFormat(props){
    const {auth,style}  = useContext(MyContext)
    const {data,error,isLoading}= useSWR(Enviroment.BASE_URL+"/fork/",fetcher)
    const token = localStorage.getItem("token")
   
    const [index,setIndex]=useState(auth?3:0)
    const Loading = ()=>{
    if(isLoading){
      return(<div><Skeleton variant='rounded' width={"100%"}/></div>)
    }
    if(error){
      return(<div style={{color:"black"}}>Error:{error.message}</div>)
    }
  }
    const greetings = ["Hi! Heard you want to be productive?",
    "Not sure where to start?",
    "Check in with yourself, everything requires focus...",
    "Ask yourself, what is the intensity of focus you want to use low or high? Then we can flow"]
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


 const fork = useCaseUnpackFork(data)
  return fork? 
      <div className='tree--format' >
      <div className='top'>
      
      {!auth?<div className='greetings m:w-64 lg:text-xl text-shadow'>
        <div>
        {index==greetings.length-1?<h4>Mindfulness</h4>:null}
      <h2>
  {greetings[index]}
      
      </h2>
      </div>
      {index!==greetings.length-1?<button className="button--next" onClick={()=>next()}>
      Next
        </button>:null}
      </div>
      :<div></div>}
      </div>
      <div style={{backgroundColor:style.primary}}  className='bottom'>
        {!fork?<Loading/>: <ul  id="tree" >
      <ForkBranch defaultOpen={true} fork={fork}/>
      </ul>}
   
      </div>
      </div>: <Loading/>
  
}




