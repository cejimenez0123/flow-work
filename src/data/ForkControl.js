


class ForkControl{
    id
    task
    choices = []
    userId
    constructor(task="start",
    choices=[new ForkControl("high",
                    []),
            new ForkControl("low",
                    [])],id,userId=null){
                        this.id=id
        this.task=task
        this.choices = choices
      this.userId=userId
    }
}

export default ForkControl