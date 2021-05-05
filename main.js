'use strict';
const GoogleImages = require('google-images');
const line = require('@line/bot-sdk');
const express = require('express');

const GIMG = new GoogleImages('9158f798cdfa53799', 'AIzaSyAG6gTt_12cJjlqBUH6-bq8PxVMGkEG69I');
const defaultAccessToken = '***********************';
const defaultSecret = '***********************';

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
//var msg =".picture test"
//var args = [].slice.call(msg);
//console.log(args)
// event handler
function handleEvent(data) {
var event=JSON.parse(JSON.stringify(data))

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  if(event.message.text=="echo"){
  var echo = { type: 'text', text: "echo" };
  
  // use reply API
  return client.replyMessage(event.replyToken, echo);
  }
  if(event.message.text.includes(".pic")){ 
    var keyword = event.message.text.replace(".pic ","")
GIMG.search(keyword)
    .then(images => {
      if(!images){client.replyMessage(event.replyToken,{type:'text',text:"request has reached the limit"});return}
        client.replyMessage(event.replyToken,{type:'image', originalContentUrl:images[0].url,previewImageUrl:images[0].thumbnail.url})
    });
}
if(event.message.text.includes(".picture")){ 
    var keyword = event.message.text.replace(".picture ","")
GIMG.search(keyword)
    .then(images => {
        client.replyMessage(event.replyToken,{type:'image', originalContentUrl:images[0].url,previewImageUrl:images[0].thumbnail.url})
    });
}}
// listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});