const line = require('@line/bot-sdk');
const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require("node-fetch").default;
const { PREFIX,CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN} = require('./util');
//settings
const lineconfig = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET
};
const cmddir = path.join(__dirname,"commands");
var commands = fs.readdirSync(cmddir);
commands.forEach(name=>{
  commands[commands.indexOf(name)]= commands[commands.indexOf(name)].replace(".js","");
}
  )
// create LINE SDK client
const client = new line.Client(lineconfig);

// create Express app
const app = express();
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'/index.html'));
});

// register a webhook handler with middleware
app.post('/webhook', line.middleware(lineconfig), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handlers
function handleEvent(data) {
var event=JSON.parse(JSON.stringify(data));
console.log(event)
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  };
  var senderId
        if(event.source.groupId){
          senderId=event.source.groupId
        }else{
            senderId=event.source.userId
        }
  if(event.message.text[0]=="-"){
    console.log("called")
     commands.forEach(name=>{
       try{
        var command = require(`./commands/${name}.js`); 
        command.opt(event,client,args);
       }catch (error) {
          console.log(error)}
     })
  }
  var args = event.message.text.split(" ");
  var cmd = args.shift().replace(PREFIX,"").toLowerCase();
  if(!event.message.text.slice(0).includes(`${PREFIX}`)){cmd=undefined//if the message has no prefix then use the chatbot if on and return no command
  if(process.env.CHATBOT=="on"&&event.message.text&&event.message.text[0]!=PREFIX){
    //brainshop AI chatbot
    fetch(`http://api.brainshop.ai/get?bid=159876&key=7wWuHwap2Xeh0eaE&uid=${event.source.userId}&msg=${encodeURIComponent(event.message.text)}`)
    .then(res=> res.json())
    .then(data=>{
      console.log(data)
      client.replyMessage(event.replyToken,{type:"text",text:data.cnt})
    })
      }}
  commands.forEach(name => {
      try {
       if(name==cmd){
      var command = require(`./commands/${name}.js`); 
      command.exec(event,client,args);
      }
  } catch (error) {
    client.pushMessage(senderId,{type:'text', text:"an error occured"});
          
  }
      }) 
    };
  
// listen on port 3000

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

