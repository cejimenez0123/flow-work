
import ForkControl from "../data/ForkControl"

function useCaseUnpackFork(data){
    if(data){
        const {id,name,style,dueDate,description,parentId,completed,userId} = data
        const fork = new ForkControl(id,name,description,style,dueDate,completed,userId,parentId,[])
        return fork
    }
    
    return null

}
export default useCaseUnpackFork