


class ForkControl{
    task
    choices = []
    constructor(task="start",
    choices=[new ForkControl("high",
                    []),
            new ForkControl("low",
                    [])]){
        this.task=task
        this.choices = choices
    }
}
export default ForkControl