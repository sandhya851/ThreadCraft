import express from "express";

import * as dotenv from 'dotenv';

import axios from "axios";

dotenv.config();

const key = process.env.AI_KEY;
const token = process.env.AI_TOKEN;
var link = "";
var data1 = {
  model: "txt2img",
  data: {
    prompt: "",
    negprompt: "lowres, signs, memes, labels, text, food, text, error, mutant, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, made by children, caricature, ugly, boring, sketch, lacklustre, repetitive, cropped, (long neck), facebook, youtube, body horror, out of frame, mutilated, tiled, frame, border, porcelain skin, doll like, doll, bad quality, cartoon, lowres, meme, low quality, worst quality, ugly, disfigured, inhuman",
    samples: 1,
    steps: 50,
    aspect_ratio: "square",
    guidance_scale: 12.5,
    seed: 2321
  }
};

var config1 = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://api.monsterapi.ai/apis/add-task',
  headers: { 
    'x-api-key': key, 
    'Authorization': token, 
    'Content-Type': 'application/json'
  },
  data : data1
};

var data2 = {
  process_id:"c4f2beb5-20d8-11ee-aaaf-4165a472aa52",
};

var config2 = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://api.monsterapi.ai/apis/task-status',
  headers: { 
    'x-api-key': key, 
    'Authorization': token
  },
  data : ''
};


const getid = async ()=>{
  let data = await axios(config1)
  .then((res)=>{
    return res.data.process_id;
  })
  .catch(error=>{
    console.log(error);
    return "error";
  })
  return data;
}




const router = express.Router();
router.route('/').get((req,res)=>{
    res.status(200).json({message:"Hello from monster api"});
})
const getLink = async ()=>{
  config2.data = JSON.stringify(data2);
  let data = await axios(config2)
  .then(res=>{
    return res.data;
  })
  .catch(error=>{
    console.log(error);
    return "error";
  })
  // console.log(data);
   link = data.response_data.result.output;
}

const awaitTimeout = delay =>
  new Promise(resolve => setTimeout(resolve, delay));

// const f = async () => {
//   await awaitTimeout(300);
//   console.log('Hi');  // Logs 'Hi' after 300ms
// };

router.route('/').post(async(req,res)=>{
  const p = req.body.prompt;
  // console.log(req.body);
  data1.data.prompt = p;
  config1.data = JSON.stringify(data1);
  let data = await getid();
  console.log(data);
  if(data == "error"){
    res.status(500).json({message:"Someting went wrong while sending the prompt"});
  }
  else{
    data2.process_id = data;
    await awaitTimeout(10000);
    await getLink();
    console.log(link);
    if(link == 'error'){
      res.status(500).json({message:"Error occured while gettting image"});
    }
    else{
      res.status(200).json(link);
    }
  }
})

export default router;







