var {IDS,BOTNAME}=require("../util");
module.exports={
    description:"about this bot",
    usage(SenderID){return`${IDS[SenderID].PREFIX}about`},
    exec(event,client,SenderID){
    var ID = IDS[SenderID]
    var msg = `Hello my name is ${BOTNAME}\ni am a bot and i have some cool features for you using commands, type ${ID.PREFIX}help to check it\n\nBot was originally made by JZ9\nsource code (github repo): https://github.com/Jasson9/LINE-JBot`
    client.replyMessage(event.replyToken,{type:'text',text:msg});
},
opt(){return}
}