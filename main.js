'use strict';
const GoogleImages = require('google-images');
const line = require('@line/bot-sdk');
const express = require('express');
const fetch = require("node-fetch").default;    
const GIMG = new GoogleImages(process.env.CSE_ID||'9158f798cdfa53799', process.env.G_API_KEY||'AIzaSyAG6gTt_12cJjlqBUH6-bq8PxVMGkEG69I');
const defaultAccessToken = '***********************';
const defaultSecret = '***********************';
const path = require('path');
//settings
const PREFIX =process.env.PREFIX||"."
var chatbot ="off"
const botname =process.env.BOTNAME
const CBAuth = process.env.SNOWFLAKE_STUDIO_API_KEY||"NjA0NzI3NjQwNzEyMDE5OTg4.MTYxNzg2NzI5Nzc2NQ==.4a0633b474c6ffb858806e961b37143b"
var hangman =[]
var words=["hello","test","aloha","dictionary","teams","pradah"]
var underscore="-"
// LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || defaultAccessToken,
  channelSecret: process.env.CHANNEL_SECRET || defaultSecret,
};
// create LINE SDK client
const client = new line.Client(config);
var wordId
// create Express app
// about Express itself: https://expressjs.com/
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'/index.html'));
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});


//get botId
var botId
fetch(`https://api.line.me/v2/bot/info`,{
  headers:{Authorization: `Bearer ${config.channelAccessToken}`
}}).then(res=>res.json()).then(data=>{data=JSON.parse(JSON.stringify(data.basicId).replace("@","")),botId=data})

// event handlers
function handleEvent(data) {
var event=JSON.parse(JSON.stringify(data))

//hangman game
function hangmangame(Token,GID,word){
  var order =[]
  var i =0
  while (i<=word.length) {
  order.push(Math.floor(Math.random()*word.length)),i++
  };
  var show = underscore.repeat(word.length).split('')
  show[order[0]]=word[order[0]] 
  console.log(Token,GID,word, show, order)
   client.replyMessage(Token,{type:"text",text:`guess this word \n ${show}`})
   if(event.message.text.toLowerCase==word){
    client.replyMessage(event.replyToken,{type:'text',text:`the answer is correct \n ${words[wordId]}`});
    hangman.splice(hangman.indexOf(GID),1);            
    return
   }
   setTimeout(() => {
    show[order[1]]=word[order[1]] 
    client.pushMessage(GID,{type:"text",text:`guess this word \n ${show}`})
  }, 15000)
   setTimeout(()=>{
    show[order[2]]=word[order[2]] 
     client.pushMessage(GID,{type:"text",text:`guess this word \n ${show}`})
  },45000)
  setTimeout(()=>{
     client.pushMessage(GID,{type:'text',text:`the answer is ${word}`})
    hangman.splice(hangman.indexOf(GID),1);
    return
  },90000);
  
  //await event.message
  //if(event.message.text==words[wordId]){
 //   client.replyMessage(event.replyToken,{type:'text',text:`the answer is correct \n ${word}`});
 //   return            
 // }else{client.replyMessage(event.replyToken,{type:'text',text:`incorrect!`});}
}

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  var args = event.message.text.split(" ")
  var cmd = args.shift().replace(PREFIX,"").toLowerCase()

  if(!event.message.text.slice(0).includes(`${PREFIX}`)){cmd=undefined//if the message has no prefix then use the chatbot if on and return no command
  if(chatbot=="on"){
    //if(!event.message.source.userId){return} 
    //if the message have userId then use the chatbot
        
    fetch(`https://api.snowflakedev.xyz/api/chatbot?message=${encodeURIComponent(event.message.text)}&name=${botname}`, {
        headers: {
            "Authorization": CBAuth        
        }
    })
        .then(res => res.json())
        .then(data => {
          client.replyMessage(event.replyToken,{type:'text',text:data.message});
        })
        .catch(e => console.error('An error occured'));
      }}
    
  console.log(args)
  console.log(cmd)
  switch(cmd){

    case "help": //show help message
     client.replyMessage(event.replyToken,{type:'text',text: `available commands: \n ${PREFIX}help: show this message \n ${PREFIX}picture: search picture using google search engine \n ${PREFIX}echo : reply back the message after the command \n ${PREFIX}chatbot : to see chatbot status or turn on or off \n ${PREFIX}invite : to show the invite link of the bot\n \n creator:JZ9`})
      break;

      case "picture": //picture search feature
        if(!args[0]){client.replyMessage(event.replyToken,{type:'text',text:"no keyword"});return}
        try{
          
          GIMG.search(args[0]).then(images => {
          if(!images){client.replyMessage(event.replyToken,{type:'text',text:"request has reached the limit"});return}
            client.replyMessage(event.replyToken,{type:'image', originalContentUrl:images[0].url,previewImageUrl:images[0].thumbnail.url})
        }).catch(err)   
        }
        catch(err){if(err){
          console.log(err)}}
        break;

      case "echo": //echo/resend the message after ${prefix}echo
          if(!args[0]){
            client.replyMessage(event.replyToken,{type:'text',text:"no message specified"});return
          }
          client.replyMessage(event.replyToken,{type:'text',text:args.join(" ")});break;
      case "invite": //add invite feature
        client.replyMessage(event.replyToken,{type:'text',text:`To invite/add this bot use this url: \n https://line.me/R/ti/p/%40${botId}`});break;

      case "chatbot": //switch on or off for the AI chatbot
        switch(args[0]){
          case "off":
            chatbot="off"
            client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now ${chatbot}`});
            break;
          case "on":
            chatbot="on"
            client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now ${chatbot} \n don't expect the responses make sense`});
            break;
          default : client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is ${chatbot}`});return
        }
        case "hangman":
        if(hangman.includes(event.source.groupId)){return};
        hangman.push(event.source.groupId)
        wordId=Math.floor(Math.random()*words.length-1)
        console.log(wordId)
        hangmangame(event.replyToken,event.source.groupId,words[wordId])
        ;break;



    
      }  
   
       
        
      
}

// listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});