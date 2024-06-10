
import { useContext, useRef, useEffect, useState } from 'react';
import "../App.css"
import MyContext from '../context';
import Colorful from '@uiw/react-color-colorful';
import { hsvaToHex,hexToHsva} from '@uiw/color-convert';
import useCaseUpdateUser from '../useCases/useCaseUpdateUser';

function Home({appRef,headerRef}){
   
    const {auth,user,setStyle,style}=useContext(MyContext)
    const [backgroundHsva,setBackgroundHsva] = useState(hexToHsva(style.backgroundColor))
    const [primaryHsva,setPrimaryHsva] = useState(hexToHsva(style.primary))
   const [textHsva,setTextHsva] = useState(hexToHsva(style.color))
  const bgRef = useRef()
  const priRef = useRef()
  const textRef = useRef()
  const btnRef = useRef()
  useEffect(()=>{

    btnRef.current.style.backgroundColor = hsvaToHex(primaryHsva)
    btnRef.current.style.color = hsvaToHex(textHsva)
  },[])
    const adjustBackgroundColor = (color)=>{
   
            setBackgroundHsva({ ...backgroundHsva, ...color.hsva})
            let hex = hsvaToHex(backgroundHsva)
           
            appRef.current.style.backgroundColor = hex
     
            
    }
    const adjustPrimaryColor = (color)=>{
         setPrimaryHsva({ ...primaryHsva, ...color.hsva })
            let hex = hsvaToHex(primaryHsva)
            headerRef.current.style.backgroundColor = hex
            btnRef.current.style.backgroundColor = hex
        
} 
const adjustTextColor = (color)=>{
  setTextHsva({ ...textHsva, ...color.hsva })
  let hex = hsvaToHex(textHsva)
    headerRef.current.style.color = hex 
     appRef.current.style.color = hex
      btnRef.current.style.color = hex
} 

  const saveUserStyle=()=>{
    const style = {
      backgroundColor: hsvaToHex(backgroundHsva),
      color: hsvaToHex(textHsva),
      primary: hsvaToHex(primaryHsva),
    }
    setStyle(style)
    useCaseUpdateUser({style},(user)=>{
    
      window.alert("saved")
    })
  }

    const adjustBgAttr = (value,element)=>{

      switch(element){

        case "s":{
          let hsva  = backgroundHsva
          hsva.s = parseInt(value.currentTarget.value) 
       
          setBackgroundHsva(hsva)
          let hex = hsvaToHex(backgroundHsva)
      appRef.current.style.backgroundColor = hex
      break
        };
      
      case "h":{

        let hsva  = backgroundHsva
       
        hsva.h = parseInt(value.currentTarget.value)
        setBackgroundHsva(hsva)
        let hex = hsvaToHex(backgroundHsva)
        appRef.current.style.backgroundColor = hex
          break
      }
      case "v":{

        let hsva  = backgroundHsva

        hsva.v = parseInt(value.currentTarget.value)
        setBackgroundHsva(hsva)
        let hex = hsvaToHex(backgroundHsva)
        appRef.current.style.backgroundColor = hex
          break
      }
       
    }
  
  }
    const adjustPrimaryAttr = (value,element)=>{
      switch(element){

        case "s":{
          let hsva  = primaryHsva
          hsva.s = parseInt(value.currentTarget.value) 
          setPrimaryHsva(hsva)
          let hex = hsvaToHex(primaryHsva)
          headerRef.current.style.backgroundColor = hex
      break
        };
      
      case "h":{
        let hsva  = primaryHsva
        hsva.h = value.currentTarget.value 
        let hex = hsvaToHex(primaryHsva)
        hsva.h = parseInt(value.currentTarget.value)
        setPrimaryHsva(hsva)
        headerRef.current.style.backgroundColor = hex
        break
      };
      case "v":{
        let hsva  = primaryHsva
        hsva.v = value.currentTarget.value 
        let hex = hsvaToHex(primaryHsva)
        hsva.v = parseInt(value.currentTarget.value)
        setPrimaryHsva(hsva)
        headerRef.current.style.backgroundColor = hex
        break
      };
      
    }
  }
  const handleTabClick = (e)=>{
    switch(e.currentTarget){
      case bgRef:{
     
        bgRef.current.checked = true
        textRef.current.style = false
        priRef.current.style = false
        break;
      }
      case textRef:{
        textRef.current.checked = true
        bgRef.current.style = false
        priRef.current.style = false
        break;
      }
      case priRef:{
        priRef.current.checked = true
        bgRef.current.style = false
        textRef.current.style = false
        break;
      }

    }
  }
      const adjustTextAttr = (value,element)=>{
        switch(element){

          case "s":{
            let hsva  = textHsva
            hsva.s = parseInt(value.currentTarget.value) 
            setBackgroundHsva(hsva)
            let hex = hsvaToHex(textHsva)
            headerRef.current.style.color = hex 
            appRef.current.style.color = hex
        break
          };
        
        case "h":{
          let hsva  = textHsva
          hsva.h = value.currentTarget.value 
          let hex = hsvaToHex(textHsva)
          hsva.h = parseInt(value.currentTarget.value)
          setTextHsva(hsva)
          headerRef.current.style.color = hex 
        appRef.current.style.color = hex
          break
        };
        case "v":{
          let hsva  = textHsva
          hsva.v = value.currentTarget.value 
          let hex = hsvaToHex(textHsva)
          hsva.v = parseInt(value.currentTarget.value)
          setTextHsva(hsva)
          headerRef.current.style.color = hex 
        appRef.current.style.color = hex
          break
        };
      }
      }
   
    return(<div >
    <div className='form-control user m-auto'> 
        <div role="tablist" className="tabs tabs-lg tabs-bordered">
  <input type="radio" name="my_tabs_1" role="tab" className="tab " onClick={(e)=>handleTabClick(e)}ref={bgRef}aria-label="Background" defaultChecked/>
  <div role="tabpanel" className="tab-content p-10">
    
  <Colorful
         color={backgroundHsva} 
       
         onChange={(color)=>adjustBackgroundColor(color)}
      />
  <h2>Saturation</h2>
  <input type="range" min={0} defaultValue={backgroundHsva.s}
  onChange={value =>adjustBgAttr(value,"s")} max="1" 
   className="range color" step="0.01" />
  <h2>Hue</h2>
  <input type="range" min={0} defaultValue={backgroundHsva.h}
  onChange={value =>adjustBgAttr(value,"h")}
   max="361"  className="range color" step="1" />
   <h2>Value</h2>
  <input type="range" min={0} defaultValue={backgroundHsva.v}
  onChange={value =>adjustBgAttr(value,"v")}
   max="100"  className="range color" step="1" />
<div className="w-full flex justify-between text-xs px-2"></div>
  
  
  
  
  </div>

  <input type="radio" name="my_tabs_1" role="tab" className="tab" onClick={(e)=>handleTabClick(e)} ref={priRef} aria-label="Primary" />
  <div role="tabpanel" className="tab-content p-10">
  <Colorful color={primaryHsva} onChange={(color)=>adjustPrimaryColor(color)}/>
  <h2>Saturation</h2>
  <input type="range" min={0} defaultValue={primaryHsva.s}
  onChange={value =>adjustPrimaryAttr(value,"s")} max="100"  className="range color" step="1" />
    <h2>Hue</h2>
    <input type="range" min={0} defaultValue={textHsva.h}
  onChange={value =>adjustPrimaryAttr(value,"h")}
   max="361"  className="range color" step="1" />
   <h2>Value</h2>
     <input type="range" min={0} defaultValue={textHsva.h}
  onChange={value =>adjustPrimaryAttr(value,"v")}
   max="100"  className="range color" step="1" />
    
    </div>

  <input type="radio" name="my_tabs_1" role="tab" className="tab" onClick={(e)=>handleTabClick(e)} ref={textRef}aria-label="Text" />
  <div role="tabpanel" className="tab-content p-10">
    
    
    
  <Colorful color={textHsva} onChange={(color)=>adjustTextColor(color)}/>
        <h2>Saturation</h2>
        <input type="range" min={0} defaultValue={textHsva.s}
                onChange={value =>adjustTextAttr(value,"s")}
                max="100"  className="range color" step="1" />
        <h2>Hue</h2>
        <input type="range" min={0} defaultValue={textHsva.h}
                onChange={value =>adjustTextAttr(value,"h")}
                max="361"  className="range color" step="1" />
    <h2>Value</h2>
        <input type="range" min={0} defaultValue={textHsva.h}
                onChange={value =>adjustTextAttr(value,"v")}
                max="100"  className="range color" step="1" />
    
    </div>

    </div> 
    <div className="btn btn-lg border-none" onClick={saveUserStyle} ref={btnRef}
      >Update</div>
      </div>  
  </div>
  )
}



export default Home