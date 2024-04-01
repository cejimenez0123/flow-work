
import axios from "axios"
import Enviroment from "../core"
function useCaseDeleteTask(params,then){
    const token = localStorage.getItem("token")
    const {list,fork}=params
  
    axios.delete(Enviroment.BASE_URL + `/fork/${fork.id}`,
       {headers: {
            Authorization: 'Bearer ' + token
       },
       data: {
        idList:list
      }}).then(result=>then(result))
}
export default useCaseDeleteTask