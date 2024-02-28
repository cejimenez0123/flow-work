
import ForkControl from "../data/ForkControl"

function useCaseUnpackFork(data){
    const {id,name,dueDate,description,parentId,completed,userId} = data
    const fork = new ForkControl(id,name,description,dueDate,completed,userId,parentId,[])
    return fork

}
export default useCaseUnpackFork