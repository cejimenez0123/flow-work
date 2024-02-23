import { useState } from 'react'
import './App.css'
import "./SmallApp.css"
import MyContext from './context'
import Header from './components/Header'
import TreeFormat from './formats/TreeFormat'
import QuizletFormat from './formats/QuizletFormat'

function App() {
  const [choices,setChoices] = useState([])
  const [format,setFormat] = useState(true)
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
         