var {IDS, CHANNEL_ACCESS_TOKEN} = require("../util");
const fetch = require('../node_modules/node-fetch');
module.exports={
    description:"show invite bot link to invite bot to another chat",
    usage(SenderID){return`${IDS[SenderID].PREFIX}invite`},
    exec(event,client){
        var BotId
        fetch(`https://api.line.me/v2/bot/info`,{
            headers:{Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
          }}).then(res=>res.json()).then(data=>{
            BotId=JSON.parse(JSON.stringify(data.basicId).replace("@",""));
            })
        client.replyMessage(event.replyToken,{type:'text',text:`To invite/add this bot use this url: \n https://line.me/R/ti/p/%40${BotId}`});
    },opt(){return}
}