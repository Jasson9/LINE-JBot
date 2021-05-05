'use strict';
const GoogleImages = require('google-images');
const line = require('@line/bot-sdk');
const express = require('express');

const GIMG = new GoogleImages('9158f798cdfa53799', 'AIzaSyAG6gTt_12cJjlqBUH6-bq8PxVMGkEG69I');
const defaultAccessToken = '***********************';
const defaultSecret = '***********************';


//settings
const prefix ="."

// create LINE SDK config from env variables
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
  res.send('Hello World!');
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handlers
function handleEvent(data) {
var event=JSON.parse(JSON.stringify(data))

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  var args = event.message.text.split(" ")
  var cmd = args.shift().replace(prefix,"")
  console.log(args)
  console.log(cmd)
  switch(cmd){
    case "help":
     client.replyMessage(event.replyToken,{type:'text',text: `available commands: \n ${prefix}help:show this message \n ${prefix}picture:search picture using google search engine \n ${prefix}echo: reply back the message \n \n creator:JZ9`})
      break;
      case "picture":
        if(!args[0]){client.replyMessage(event.replyToken,{type:'text',text:"no keyword"});return}
        try{
          GIMG.search(args[0].then(images => {
          if(!images){client.replyMessage(event.replyToken,{type:'text',text:"request has reached the limit"});return}
            client.replyMessage(event.replyToken,{type:'image', originalContentUrl:images[0].url,previewImageUrl:images[0].thumbnail.url})
        }))    
        }
        catch(err){if(err){
          console.log(err)}}
        break;
      case "echo":
          if(!args[0]){
            client.replyMessage(event.replyToken,{type:'text',text:"no message specified"});return
          }
          client.replyMessage(event.replyToken,{type:'text',text:args[0]});break;
    default:
     client.replyMessage(event.replyToken,{type:'text',text:`no command use ${prefix}help for more info`})
  }
}
// listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});