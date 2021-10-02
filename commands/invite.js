var {IDS, CHANNEL_ACCESS_TOKEN} = require("../util");
const fetch = require('../node_modules/node-fetch');
module.exports={
    description:"show bot's invite link to invite it into another chat",
    usage(prefix){return`${prefix}invite`},
    exec(event,client){
        var BotId
        fetch(`https://api.line.me/v2/bot/info`,{
            headers:{Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
          }}).then(res=>res.json()).then(data=>{
            BotId=JSON.parse(JSON.stringify(data.basicId).replace("@",""));
            client.replyMessage(event.replyToken,{type:'text',text:`To invite/add this bot use this url: \n https://line.me/R/ti/p/%40${BotId}`});
            })
        
    }
}