import Enviroment from "../core";
import axios from "axios";
export default function useCaseUploadFile(params,then){
        const token = localStorage.getItem("token")
        const {file}=params
       
        let formData = new FormData()
        formData.append('file', file)
   fetch(Enviroment.createURL("/fork/file"), {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization':"Bearer "+token
      },
    }).then(res=>{
        then(res.data)
      }).catch(err=>{
        then(err)
      })
    

          
       
}