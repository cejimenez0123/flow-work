import { useEffect,useState ,useContext} from "react";
import useSWR from 'swr'
import Enviroment from "../core";
import axios from "axios"
import MyContext from "../context";
const fetcher = (url, token) =>axios.get(url, { headers: { Authorization: "Bearer " + token } })
  .then((res) => res.data);
export default function useForkChildren({fork}){

    const [url,setUrl]=useState(Enviroment.BASE_URL+`/fork/children/${fork.id??"65ce6f093ed66e8a5da96c07"}`)
    const { data,error,isLoading } = useSWR([url,localStorage.getItem("token")??""], ([url, token]) => fetcher(url,token))
    const [state,setState]=useState({choices:data??[],error:error,isLoading:isLoading})
    const {auth}=useContext(MyContext)

    // }
    useEffect(()=>{
        // changeUrl(fork)
        if(auth){ 
            setUrl(Enviroment.BASE_URL+`/fork/protected/children/${fork.id}`)
        }else{
            setUrl(Enviroment.BASE_URL+`/fork/children/${fork.id??"65ce6f093ed66e8a5da96c07"}`)
        }
    },[auth])
    useEffect(()=>{
        let sorted = data?sortByLatestDate(data):[]
        setState({choices:sorted,error:error,isLoading:isLoading})

    },[data])
    return state
}
function sortByLatestDate(data) {
    // Use the sort method with a custom comparison function
    return data.sort((a, b) => {
      // Convert date strings to Date objects
      if(a.dueDate!=null && b.dueDate!=null){
      const dateA = a.dueDate?new Date(a.dueDate):new Date(); // Assuming "date" is the property containing the date
      const dateB = b.dueDate?new Date(b.dueDate):new Date();
  
      // Use getTime() to get timestamps in milliseconds
      const timestampA = dateA.getTime()
      const timestampB = dateB.getTime();
  
      // Sort by descending order (later date has higher timestamp)
      return timestampA - timestampB ;
      }else{
        if(a.created && b.created){
            const dateA = a.dueDate?new Date(a.dueDate):new Date(); // Assuming "date" is the property containing the date
            const dateB = b.dueDate?new Date(b.dueDate):new Date();
        
            // Use getTime() to get timestamps in milliseconds
            const timestampA = dateA.getTime()
            const timestampB = dateB.getTime();
        
            // Sort by descending order (later date has higher timestamp)
            return timestampA- timestampB ;
        }
      }
    });
  }