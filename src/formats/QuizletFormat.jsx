import { useState } from "react"
import ForkControl from "../data/ForkControl"
import Enviroment from "../core"
import useSWR from "swr"
import Fork from "../components/Fork"
import axios from "axios"
import useCaseUnpackFork from "../useCases/useCaseUnpackFork"
const fetcher = (url) =>axios.get(url)
  .then((res) => res.data);
function QuizletFormat(props){
    const [start,setStart] = useState(false)
  
    const {data,error,isLoading}= useSWR(Enviroment.BASE_URL+"/fork/",fetcher)
    const handleStart = ()=>{
          setStart(true)
      } 
      const ForkDiv =(props)=>{
        if(isLoading){
          return<div className="loading">

            Loading...
          </div>
        }
        if(error){
          if(error.message=="Network Error"){
          return <div class="error">
            <h3 className='error--text'>
           There is a lack of an Internet Connection
           </h3>
          </div>
          }else{
            return <div>
            Error:{error.message}
          </div>
          }
        }
    if(data){
          const fork = useCaseUnpackFork(data)
          return <div>
          <Fork root={fork} />
          </div>
        }
        }
    return(
      <div>
    {start?
      <ForkDiv />:
      <div id="quizlet--format">
      <button className='start--button' onClick={handleStart}>
        Start
      </button>
      </div>}
      </div>
);
}
export default QuizletFormat