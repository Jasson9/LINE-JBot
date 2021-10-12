const line = require('@line/bot-sdk');
const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require("node-fetch").default;
const {IDS,PREFIX,CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN, SEARCH_ENGINE, CBSTATUS} = require('./util');
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
//console.log(event)
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  };
  var SenderID
        if(event.source.groupId){
          SenderID=event.source.groupId
        }else{
          SenderID=event.source.userId
        }
    if(!IDS[SenderID]||IDS[SenderID]==undefined){
      IDS[SenderID]={
        "PREFIX":PREFIX,
        "CBSTATUS":CBSTATUS,
        "HANGMAN":{},
        "SEARCH":{
          ID:"",
          KEYWORD:"",
          PAGE:1,
          ENGINE:SEARCH_ENGINE,
          LANG:"EN"
        },
        "JUMBLE":{}
      }
    }
  var args = event.message.text.split(" ");
  if (args[0][0]!=IDS[SenderID].PREFIX){
     commands.forEach(name=>{
       try{
        var command = require(`./commands/${name}.js`);
        if(typeof command.opt!=='function'){
          return
        } 
        command.opt(event,client,SenderID,args);
       }catch (error) {
          console.log(error)}
     })
    }
  var cmd = args.shift().replace(IDS[SenderID].PREFIX,"").toLowerCase();
  if(!event.message.text.slice(0).includes(`${IDS[SenderID].PREFIX}`)){cmd=undefined//if the message has no prefix then use the chatbot if on and return no command
  if(IDS[SenderID].CBSTATUS=="on"&&event.message.text&&event.message.text[0]!=IDS[SenderID].PREFIX){
    //brainshop AI chatbot
    fetch(`http://api.brainshop.ai/get?bid=159876&key=7wWuHwap2Xeh0eaE&uid=${event.source.userId}&msg=${encodeURIComponent(event.message.text)}`)
    .then(res=> res.json())
    .then(data=>{
      client.replyMessage(event.replyToken,{type:"text",text:data.cnt})
    })
      }}
  commands.forEach(name => {
      try {
       if(name==cmd){
      var command = require(`./commands/${name}.js`); 
      command.exec(event,client,SenderID,args);
      }
  } catch (error) {
    console.log(error)
    client.replyMessage(event.replyToken,{type:'text', text:"an error occured"});
  }
      }) 
    };
  
// listen on port 3000

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

