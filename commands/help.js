var {IDS}=require("../util");
module.exports={
description:"show commands with instruction if the command name specified",
usage(SenderID){return `${IDS[SenderID].PREFIX}help \n${IDS[SenderID].PREFIX}help <command name>`},
//show help message
exec(event,client,SenderID,args){
    var fs = require('fs');
    var commands = fs.readdirSync(__dirname);
    commands.forEach(name=>{
        commands[commands.indexOf(name)]= commands[commands.indexOf(name)].replace(".js","")
    })
    var msg = []

    if(!args[0]){
        msg.push("available commands:\n")
        commands.forEach(name => {
            let command = require(`./${name}.js`)
            msg.push(`.${name}\n`)
            msg.push(`${command.description}\n\n`)
        });
    }else{
        var command = require(`./${args[0]}.js`)
            msg.push(`.${args[0]}\n`)
            msg.push(`${command.description}\n\n`)
            msg.push(`usage : ${command.usage(SenderID)}`)
    }
    client.replyMessage(event.replyToken,{type:'text',text:msg.join("")});
    //client.replyMessage(event.replyToken,{type:'text',text: msg})
    return
    
},
opt(){return}
}