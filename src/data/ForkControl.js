


class ForkControl{
   id
   name
   dueDate
   completed
   userId
   parentId
   forks
   constructor(id,name,dueDate,completed=false,userId,parentId,forks){
    this.id = id;
    this.name = name;
    this.dueDate = dueDate;
    this.completed = completed;
    this.userId = userId;
    this.parentId = parentId;
    this.forks = forks;
   }
}

export default ForkControl