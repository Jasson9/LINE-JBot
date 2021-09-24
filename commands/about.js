var {PREFIX, BOTNAME}=require("../util");
module.exports={
    description:"about this bot",
    usage:`${PREFIX}about`,
    exec(event,client){
    var msg = `Hello my name is ${BOTNAME}\ni am a bot and i have some cool feature for you using commands, type ${PREFIX}help to check it\n\nBot was originally made by JZ9\nsource code (github repo): https://github.com/Jasson9/LINE-JBot`
    client.replyMessage(event.replyToken,{type:'text',text:msg});
},
opt(){return}
}