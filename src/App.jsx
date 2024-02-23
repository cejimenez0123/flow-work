import { useState } from 'react'
import axios from "axios"
import './App.css'
import "./SmallApp.css"
import Fork from './components/Fork'
import ForkControl from './data/ForkControl'
import Enviroment from './core'
import MyContext from './context'
import Header from './components/Header'
import useSWR from 'swr'
import TreeFormat from './formats/TreeFormat'
import QuizletFormat from './formats/QuizletFormat'

const fetcher = (url) =>axios.get(url)
  .then((res) => res.data);
function App() {
  const [start,setStart] = useState(false)
  const [choices,setChoices] = useState([])
  const [format,setFormat] = useState(false)

 

  
  return (
      <div className='App'>
        <MyContext.Provider value={{choices,setChoices,format,setFormat}}>
          <Header/>
          {format?
             <TreeFormat />:
             <QuizletFormat/>
        }
     </MyContext.Provider>
</div>
  )
}

export default App
         