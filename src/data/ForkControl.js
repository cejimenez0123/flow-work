


export default class ForkControl{
   id
   name
   dueDate
   description
   completed
   userId
   parentId
   forks
   style
   constructor(id,name,description,style,dueDate,completed=false,userId,parentId,forks){
    this.id = id;
    this.name = name;
    this.dueDate = dueDate;
    this.style=style;
this.description = description;
    this.completed = completed;
    this.userId = userId;
    this.parentId = parentId;
    this.forks = forks;
   }
}

