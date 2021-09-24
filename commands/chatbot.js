const { PREFIX } = require('../util');
module.exports={
description:"toogle on and off chatbot",
usage : `${PREFIX}chatbot on \n${PREFIX}chatbot off`,
exec(event,client,args){
  console.log(args[0])
    //switch on or off for the AI chatbot
    switch(args[0]){
      case "off":
        process.env.CHATBOT="off"
        client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now off`});
        break;
      case "on":
        process.env.CHATBOT="on"
        client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is now on`});
        break;
      default : client.replyMessage(event.replyToken,{type:'text',text:`the AI chatbot is ${process.env.CHATBOT}`});return
    }
},opt(){return}

}