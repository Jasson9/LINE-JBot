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
var chatbot =[]
const botname =process.env.BOTNAME
const CBAuth = process.env.SNOWFLAKE_STUDIO_API_KEY||"NjA0NzI3NjQwNzEyMDE5OTg4.MTYxNzg2NzI5Nzc2NQ==.4a0633b474c6ffb858806e961b37143b"
var words=["hello","dictionary","intelligent","respect","beautiful","problem","help","shock","wealthy","zigzag","destiny","destination","simple","answer","combination","serious","colour","meaningless","amazing","repeat","profile","teams","underestimate","impossible","training","predictable","celebrate","unknown","alone","prepare","something","lower","love","control","confirmation","confirm","end","delight","afraid","height","setting","junior","senior","apply","master","verify","handle","harvest","people","jealous","happy","memory","deny","abort","style","school","global","pandemic","quarantine"]
var cache ={"hangman":{}}
// LINE SDK config from env variables
const config = {
  channelAccessToken: "Uo3gYpv3LTd/nKHdYIz1/gqzKxk/rddQi9W+d4bCCG6z+1PIae8euhOo8WGome1shyh/wD9Brn8YnzQtDp5uekxl5H1hSWHW2ot3dbhfyK0h1cfiAatZfO1wNYq44T1jsbO/IYVyLuea4bfd38+oAQdB04t89/1O/w1cDnyilFU="||process.env.CHANNEL_ACCESS_TOKEN || defaultAccessToken,
  channelSecret: process.env.CHANNEL_SECRET || defaultSecret,
};
// create LINE SDK client
const client = new line.Client(config);

//assign cache data function
function assigncache(activity,GID,ID,data,data2){
if(activity&&GID){
cache[activity]=[GID]
  if(ID){
    cache[activity][GID]=[ID]
    if(data&&!data2){
      cache[activity][GID][ID]=data
      }else{
    if(data1&&data2){
        cache[activity][GID][ID]=data2
      }}
    }
  }return
}

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
  console.log(cache.hangman)
var event=JSON.parse(JSON.stringify(data))
//hangman game
function hangmangame(Token,GID,word,ID){
  //count '-'
  function count(data){
    let counter = 0;
for (let i = 0;i<data.length; i++) {
  if (data[i] == '-'){counter++};
}return(counter)
  }
  var order =[]
  var i =0
  while (i<=word.length) {
  order.push(Math.floor(Math.random()*word.length)),i++
  };
  var show = "-".repeat(word.length).split('')
  show[order[0]]=word[order[0]] 
  console.log(Token,GID,word, show, order)
   client.replyMessage(Token,{type:"text",text:`guess this word and save this person \n${show.join('')} \n \n you have 90 seconds`})

   setTimeout(() => { //15 seconds
     if(cache.hangman[GID].includes(ID)){
      if(count(show)>2){
    show[order[1]]=word[order[1]]} 
    client.pushMessage(GID,{type:"text",text:`75 seconds left! \n${show.join('')} \n \n \n / `})

   setTimeout(()=>{ // 30 seconds
    if(cache.hangman[GID].includes(ID)){
    if(count(show)>2){
    show[order[2]]=word[order[2]]} 
     client.pushMessage(GID,{type:"text",text:`60 seconds left! \n${show.join('')} \n\n  \n / \\`})

     setTimeout(()=>{
      if(cache.hangman[GID].includes(ID)){ // 45 seconds
     if(count(show)>2){
     show[order[3]]=word[order[3]] }
      client.pushMessage(GID,{type:"text",text:`45 seconds left! \n${show.join('')}\n\n  |\n / \\ `})
  
    setTimeout(()=>{
      if(cache.hangman[GID].includes(ID)){ // 60 seconds
     if(count(show)>2){
     show[order[4]]=word[order[4]] }
      client.pushMessage(GID,{type:"text",text:`30 seconds left! \n${show.join('')}\n\n /|\n / \\ `})
    
    setTimeout(()=>{
      if(cache.hangman[GID].includes(ID)){ // 75 seconds
     if(count(show)>2){
     show[order[5]]=word[order[5]] }
      client.pushMessage(GID,{type:"text",text:`15 seconds left! \n${show.join('')}\n\n /|\\\n / \\ `})
      
    setTimeout(()=>{ //dead
      if(cache.hangman[GID].includes(ID)){
       client.pushMessage(GID,{type:'text',text:`owh no he is dead! \nthe answer is ${word} \n\n  |\n  X\n /|\\\n / \\ `})
       cache.hangman.splice(cache["hangman"].indexOf(GID),1)
      return
    }else{return}
  },15000)
}else{return}
  },15000)
}else{return}
  },15000)
}else{return}
  },15000)  
}else{return}
  },15000)
}else{return}
  }, 15000);
  return
}

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  var args = event.message.text.split(" ")
  var cmd = args.shift().replace(PREFIX,"").toLowerCase()

  if(!event.message.text.slice(0).includes(`${PREFIX}`)){cmd=undefined//if the message has no prefix then use the chatbot if on and return no command
  if(chatbot.includes(event.source.groupId)){
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
     client.replyMessage(event.replyToken,{type:'text',text: `available commands: \n ${PREFIX}help: show this message \n ${PREFIX}picture: search picture using google search engine \n ${PREFIX}echo : reply back the message after the command \n ${PREFIX}chatbot : to see chatbot status or turn on or off \n ${PREFIX}invite : to show the invite link of the bot \n ${PREFIX}hangman: play hangman(still buggy)\n \n creator:JZ9`})
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
            chatbot.push(event.source.groupId)
            client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now ${chatbot}`});
            break;
          case "on":
            chatbot.push(event.source.groupId)
            client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now ${chatbot} \n don't expect the responses make sense`});
            break;
          default : client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is ${chatbot}`});return
        }
      case "hangman":
        switch(args[0]){
            case"stop":
            client.pushMessage(event.source.groupId,{type:'text',text:`hangman game has been stopped`})
            cache.hangman.splice(cache["hangman"].indexOf(event.source.groupId),1)
            ;break;
        default:
        if(cache.hangman[event.source.groupId]){client.pushMessage(event.source.groupId,{type:'text',text:`the game have already running, to stop it use ${PREFIX}hangman stop`});return};
        var wordId=Math.floor(Math.random()*words.length)
        console.log(words[wordId])
        var id=Math.floor(Math.random()*1000000)
        assigncache("hangman",event.source.groupId,id,words[wordId])
        hangmangame(event.replyToken,event.source.groupId,words[wordId],id)
          }
        ;break;
default:
  console.log(event.message.text)
  if(cache.hangman.includes(event.source.groupId)){
    if(event.message.text==cache.hangman[event.source.groupId][cache.hangman[event.source.groupId][0]][0]){
      client.getProfile(event.source.userId).then((data)=>{
      client.pushMessage(event.source.groupId,{type:'text',text:`${data.displayName} answer's is correct \n${cache.hangman[event.source.groupId][cache.hangman[event.source.groupId][0]][0]}`})
      cache.hangman.splice(cache["hangman"].indexOf(event.source.groupId),1)       
      return})
     }else{client.pushMessage(event.source.groupId,{type:'text',text:`incorrect!`});}
      }     
      }
}

// listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});