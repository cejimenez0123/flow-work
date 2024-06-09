
import ForkControl from "../data/ForkControl"

function useCaseUnpackFork(data){
    if(data){
        const {id,name,style,dueDate,description,parentId,link,completed,userId} = data
        const fork = new ForkControl(id,name,description,style,dueDate,completed,userId,parentId,link,[])
        return fork
    }
    
    return null

}
export default useCaseUnpackFork