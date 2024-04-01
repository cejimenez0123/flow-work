


export default class User {
    id
    email
    style


    constructor(id,email,style={}){
        this.id = id;
        this.email = email;
        this.style = style;
    }
    isNull= this.id == null || this.email == null
    
}
