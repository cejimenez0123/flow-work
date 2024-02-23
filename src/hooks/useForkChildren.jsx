import { useEffect,useState } from "react";
import useSWR from 'swr'
import Enviroment from "../core";
import axios from "axios"
const fetcher = (url, token) =>axios.get(url, { headers: { Authorization: "Bearer " + token } })
  .then((res) => res.data);
export default function useForkChildren({fork}){

    const [url,setUrl]=useState((Enviroment.BASE_URL+`/fork/children/${fork.id??"65ce6f093ed66e8a5da96c07"}`))
    const { data,error,isLoading } = useSWR([url,localStorage.getItem("token")??""], ([url, token]) => fetcher(url,token))
    const [state,setState]=useState({choices:data??[],error:error,isLoading:isLoading})
    const changeUrl =(root)=>{
        if(localStorage.getItem("token")!=="null" && localStorage.getItem("token")!==null && 
        ((root.userId !== Enviroment.ADMIN_UID && !Enviroment.root_array.includes(root.id)
            ))){ 
            setUrl(Enviroment.BASE_URL+`/fork/protected/children/${root.id}`)
        }else{
            setUrl(Enviroment.BASE_URL+`/fork/children/${root.id??"65ce6f093ed66e8a5da96c07"}`)
        }
    }
    useEffect(()=>{
        changeUrl(fork)

    },[])
    useEffect(()=>{
        setState({choices:data??[],error:error,isLoading:isLoading})

    },[data])
    return state
}