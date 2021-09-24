var {PREFIX}=require("../util");
module.exports={
description:"show commands with instruction if the command name specified",
usage : `${PREFIX}help \n${PREFIX}help <command name>`,
//show help message
exec(event,client,args){
var fs = require('fs');
var commands = fs.readdirSync(__dirname);
commands.forEach(name=>{
    commands[commands.indexOf(name)]= commands[commands.indexOf(name)].replace(".js","")
})
var msg = []

if(!args[0]){
    commands.forEach(name => {
        let command = require(`./${name}.js`)
        msg.push(`.${name}\n`)
        msg.push(`${command.description}\n\n`)
    });
}else{
    var command = require(`./${args[0]}.js`)
        msg.push(`.${args[0]}\n`)
        msg.push(`${command.description}\n\n`)
        msg.push(`usage : ${command.usage}`)
}
client.replyMessage(event.replyToken,{type:'text',text:msg.join("")});
//client.replyMessage(event.replyToken,{type:'text',text: msg})
return
    
},opt(){return}
}