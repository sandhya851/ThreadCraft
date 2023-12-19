import React, { useState } from 'react'
import CustomButton from './CustomButton'



const AiPicker = ({ailink,setAilink,prompt,setPrompt,generatingImg,handleSubmit}) => {

  
  return (
    <div className='aipicker-container'>
       <textarea
       placeholder='Ask AI..'
       rows={5}
       value={prompt}
       onChange={(e)=>setPrompt(e.target.value)}
       className='aipicker-textarea'
       />
       {ailink && (<a href={ailink}>Download the Image</a>)}
       <div className='flex flex-wrap gap-3'> 
        { generatingImg ? (
          <CustomButton
          type='outline'
          title="Asking AI"
          customStyles='text-xs'
          />
        ) :(
          <>
          <CustomButton
          type='outline'
          title="Get AI image"
          handleClick={()=>handleSubmit()}
          customStyles='test-xs'
          />
          </>
        )}
       </div>
    </div>
  )
}

export default AiPicker