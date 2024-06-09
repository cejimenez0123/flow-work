const RAILWAY_URL="https://flow-node-production.up.railway.app"
const DEV_URL ="http://localhost:4000"
const WorkHigh = {
    id:"65ce77bcd2bd472600937db2"
}
const RelaxHigh = {
    id:"65ce77b1d2bd472600937db1"
}
const RelaxLow = {
    id:"65ce77d5d2bd472600937db4"
}
const WorkLow = {
    id: "65ce77ced2bd472600937db3"
}
const Walk = {
    id:"65ce786ad2bd472600937db8"
}
const Low ={
    id:"65ce716ed5fdcc737951f33a"
}
const High = {
    id:"65ce7183d5fdcc737951f33b"
}
const Clean = {
    id: "65ce78e1d2bd472600937dbe"
}
const Draw = {
    id:"65ce78a3d2bd472600937dbd"
}
const Focus ={
    id:"65ce6f093ed66e8a5da96c07"
}
const Enviroment = {
    BASE_URL: DEV_URL,
    createURL: (path)=>{return DEV_URL+path},
    WORK_ARRAY:[Low.id,High.id,Focus.id],
    root_array:[
      
        WorkLow.id,
        WorkHigh.id,
        RelaxHigh.id,
        RelaxLow.id,
       
        //Walk
        "65ce786ad2bd472600937db8",
        //Clean
        "65ce78e1d2bd472600937dbe",
        //Draw
        "65ce78a3d2bd472600937dbd",
        //Paint
        "65ce789ed2bd472600937dbc",
        //Dance
        "65ce7899d2bd472600937dbb",
        //Clean
        "65ce78e1d2bd472600937dbe",
                        "65ce77bcd2bd472600937db2",
                "65ce77ced2bd472600937db3",
                //Read
                "65ce780dd2bd472600937db5",
                //Meditate
                "65ce787cd2bd472600937dba",
                //Write
                "65ce7814d2bd472600937db6",
                //Origami
                "65ce7851d2bd472600937db7",
                //Youtube
                "65ce7871d2bd472600937db9",

            ]
            
                
}
const Router = {
    base: {
        createRoute:()=>"/flow-work/"
    },
    home: {
        createRoute:()=>"/flow-work/home/"
    }
}
export {Router}
export default Enviroment