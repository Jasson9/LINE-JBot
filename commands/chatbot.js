var {IDS} = require('../util');
module.exports={
description:"toogle on and off chatbot",
usage(SenderID){return `${IDS[SenderID].PREFIX}chatbot on \n${IDS[SenderID].PREFIX}chatbot off`},
exec(event,client,SenderID,args){
  var ID = IDS[SenderID]
  console.log(args[0])
    //switch on or off for the AI chatbot
    switch(args[0]){
      case "off":
        ID.CBSTATUS="off"
        client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now off`});
        break;
      case "on":
        ID.CBSTATUS="on"
        client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now on`});
        break;
      default : client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is ${ID.CHATBOT}`});return
    }
},opt(){return}

}