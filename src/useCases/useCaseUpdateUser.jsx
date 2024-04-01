import Enviroment from "../core";
import axios from "axios";
export default function useCaseUpdateUser(params,then){
        const token = localStorage.getItem("token")
        
        axios.put(Enviroment.BASE_URL+`/user/`, params,{headers:{
            Authorization: 'Bearer ' + token
        }})
  .then(response => {
   then(response)
  })
  .catch(error => {
    console.error(error)
  });
       
}