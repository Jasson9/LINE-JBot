var {IDS,BOTNAME}=require("../util");
module.exports={
    description:"about this bot",
    usage(prefix){return`${prefix}about`},
    exec(event,client,SenderID){
    var ID = IDS[SenderID]
    var users = [] 
    for (const [key] of Object.entries(IDS)) {
        users.push(key)       
      }
    var msg = `Hello my name is ${BOTNAME}\ni am a bot and i have some cool features for you using commands, type ${ID.PREFIX}help to check it\n\nBot has been used by ${users.length} chatters\n\nBot was originally made by Jasson9\nsource code (github repo): https://github.com/Jasson9/LINE-JBot`
    client.replyMessage(event.replyToken,{type:'text',text:msg});
}
}