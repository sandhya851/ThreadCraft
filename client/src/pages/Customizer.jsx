import { AnimatePresence,motion} from 'framer-motion'
import React, {useState,useEffect} from 'react'
import { useSnapshot } from 'valtio'
import config from '../config/config'
import state from '../store' 
import {download} from '../assets/'
import {downloadCanvasToImage,reader} from '../config/helpers'
import {EditorTabs,FilterTabs,DecalTypes} from '../config/constants'

import { fadeAnimation,slideAnimation } from '../config/motion'

import { AiPicker,ColorPicker,FilePicker,Tab,CustomButton } from '../components'



const Customizer = () => {

    const snap = useSnapshot(state);
    //show tab cotent depending on active tab
    const [file,setFile] =  useState('');
    const [prompt,setPrompt] = useState('');
    const[ailink,setAilink] = useState('');
    const [generatingimg,setGeneratingimg] = useState('');
    const [activeEditorTab,setactiveEditorTab] = useState('');
    const [activeFilterTab,setActiveFilterTab] = useState({
        logoShirt:true,
        stylishShirt:false
    })

    //show tab content depending on the activeTab
    const generateTabContent = ()=>{
        switch(activeEditorTab){
            case "colorpicker":
                return <ColorPicker/>
            case "filepicker":
                return <FilePicker
                file = {file}
                setFile = {setFile}
                readFile = {readFile}
                />
            case "aipicker":
                return <AiPicker
                ailink={ailink}
                setAilink={setAilink}
                prompt={prompt}
                setPrompt={setPrompt}
                generatingImg={generatingimg}
                handleSubmit={handleSubmit}
                />
            default:
                return null;
        }
    }

    const awaitTimeout = delay =>
  new Promise(resolve => setTimeout(resolve, delay));


  const handleSubmit = async()=>{
    if(!prompt)return alert("Please enter a prompt");
    try{
        setGeneratingimg(true);
        const response = await fetch('http://localhost:8080/ai/api',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                prompt,
            })
        })
        await awaitTimeout(5000);
        // console.log(response);
        const data = await response.json();
        console.log(data);
        setAilink(data[0]);
    }
    catch(error){
        alert(error);
    }finally{
        setGeneratingimg(false);
    }
}

    const handleDecals = (type,res)=>{
        const decalType = DecalTypes[type];
        state[decalType.stateProperty] = res;
        if(!activeFilterTab[decalType.filterTab]){
            handleActiveFilterTab(decalType.filterTab);
        }
    }
    const handleActiveFilterTab = (tabName)=>{
        switch(tabName){
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[tabName];
                break;
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName];
                break;
            default:
                state.isFullTexture=false;
                state.isLogoTexture=true;
                break;
        }
        setActiveFilterTab((prevState)=>{
            return {
                ...prevState,
                [tabName] : !prevState[tabName]
            }
        })
    }




    const readFile = (type)=>{
        reader(file)
        .then((res)=>{
            handleDecals(type,res);
            setactiveEditorTab("");
        })
    }

  return (
    <AnimatePresence>
        {!snap.intro && (
            <>
            <motion.div
            key="custom"
            className = "absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
            >
                <div className='flex items-center min-h-screen'>
                <div className='editortabs-container tabs'>
                {
                    EditorTabs.map((tab)=>(
                        <Tab
                        key={tab.name}
                        tab={tab}
                        handleClick={()=>{setactiveEditorTab(tab.name)}}></Tab>
                    ))
                }
                {generateTabContent()}
                </div>

                </div>
            </motion.div>
            <motion.div
            className='absolute z-10 top-5 right-5'
            {...fadeAnimation}
            >
            <CustomButton
            type="filled"
            title="Go Back"
            handleClick={()=>state.intro = true}
            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
            </motion.div>
            <motion.div
            className='filtertabs-container'
            {...slideAnimation('up')}
            >
                {
                    FilterTabs.map((tab)=>(
                        <Tab
                        key={tab.name}
                        tab={tab}
                        isFilterTab
                        isActiveTab={activeFilterTab[tab.name]}
                        handleClick={()=>handleActiveFilterTab(tab.name)}></Tab>
                    ))
                }
            </motion.div>
            </>
        )}
    </AnimatePresence>
  )
}

export default Customizer