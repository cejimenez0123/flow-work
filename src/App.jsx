import { useEffect, useLayoutEffect, useState } from 'react'
import axios from "axios"
import './App.css'
import Fork from './components/Fork'
import ForkControl from './data/ForkControl'
import Enviroment from './core'
import MyContext from './context'
import Header from './components/Header'
import useSWR from 'swr'

const fetcher = (url) =>axios.get(url)
  .then((res) => res.data);
function App() {
  const {data,error,isLoading}= useSWR(Enviroment.BASE_URL+"/fork/",fetcher)
  const [start,setStart] = useState(false)
  const [choices,setChoices] = useState([])
  const handleStart = ()=>{
        setStart(true)
    } 
  const startOver = ()=>{
      setStart(false)
    } 
 

  const ForkDiv =()=>{
    if(isLoading){
      return<div>
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
      const {id,name,dueDate,parentId,completed,userId} = data
    
      const fork = new ForkControl(id,name,dueDate,completed,userId,parentId,[])
    
      return <div>
      <Fork root={fork} />
      </div>
    }
  }
  return (
      <div className='App'>
        <MyContext.Provider value={[choices,setChoices]}>
          <Header/>
          <main>
            <div className='main--buttons'>
              {start?
                <ForkDiv/>:
                <button className='start--button' onClick={handleStart}>
                  Start
                </button>}
            <div>
              <button className="start-over"onClick={startOver}>Start Over</button>
              </div>
            </div>
          </main>
     </MyContext.Provider>
</div>
  )
}

export default App
