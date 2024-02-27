import axios from "axios"
import Enviroment from "../core"

function useCaseUpdateFork(params,then){
    const {fork,completed,
        dueDate,
        name,
        description}=params
        const token = localStorage.getItem("token")
        
        axios.put(Enviroment.BASE_URL+`/fork/${fork.id}`, params,{headers:{
            Authorization: 'Bearer ' + token
        }})
  .then(response => {
   then(response)
  })
  .catch(error => {
    console.error(error)
  });
       
}
export default useCaseUpdateFork