var {PREFIX}=require("../util");
module.exports={
description:"send back message",
usage:`${PREFIX}echo <message>`,
exec(event,client,args){
    //echo/resend the message after ${prefix}echo
    if(!args[0]){
      client.replyMessage(event.replyToken,{type:'text',text:"no message specified"});return
    }
    client.replyMessage(event.replyToken,{type:'text',text:args.join(" ")});
},opt(){return}

}