'use strict';
const GoogleImages = require('google-images');
const line = require('@line/bot-sdk');
const express = require('express');
const fetch = require("node-fetch").default;    
const GIMG = new GoogleImages('9158f798cdfa53799', 'AIzaSyAG6gTt_12cJjlqBUH6-bq8PxVMGkEG69I');
const defaultAccessToken = '***********************';
const defaultSecret = '***********************';
const path = require('path')

//settings
const PREFIX =process.env.PREFIX||"."
var chatbot ="off"
const botname =process.env.BOTNAME||"JBot"
const CBAuth = process.env.SNOWFLAKE_STUDIO_API_KEY||"NjA0NzI3NjQwNzEyMDE5OTg4.MTYxNzg2NzI5Nzc2NQ==.4a0633b474c6ffb858806e961b37143b"

// LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || defaultAccessToken,
  channelSecret: process.env.CHANNEL_SECRET || defaultSecret,
};

// create LINE SDK client
const client = new line.Client(config);

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

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  var args = event.message.text.split(" ")
  var cmd = args.shift().replace(PREFIX,"").toLowerCase()
  if(!event.message.text.slice(0).includes(`${PREFIX}`)){//if the message has prefix then use command instead of chatbot
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
     client.replyMessage(event.replyToken,{type:'text',text: `available commands: \n ${PREFIX}help: show this message \n ${PREFIX}picture: search picture using google search engine \n ${PREFIX}echo: reply back the message \n \n creator:JZ9`})
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
            client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now ${chatbot}`});
            break;
          default : client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is ${chatbot}`});return
        }
  }
}
// listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});