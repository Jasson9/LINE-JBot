var {IDS}=require('../util')
const fs = require('fs')
module.exports={
    description:'override user setting',
    usage(prefix){
        return `${prefix}setting <command name> <arguments>\nyou can check the arguments using ${prefix}setting <command name>`
    },
    exec(event,client,SenderID,args){
    var keyword = args
    if(!args[0]){
        var commands = fs.readdirSync(__dirname)
        var availcommands =[]
        commands.forEach(name=>{
            if(typeof require(`./${name}`).set=='function'){
                availcommands.push(name.replace('.js',''))
            }
          }
            )
        client.replyMessage(event.replyToken,{type:'text',text:`${this.usage(IDS[SenderID].PREFIX)}\n\navailable command to change the settings:\n${availcommands.join('\n')}`})
    }else{
        var commandname = keyword.shift()
        var command = require(`./${commandname}.js`)
        if(typeof command.set!=='function'){
            client.replyMessage(event.replyToken,{type:'text',text:`the command's setting can't be changed`})
            return
        }
        try {
            command.set(event,client,SenderID,keyword)
        } catch (error) {
            client.replyMessage(event.replyToken,{type:'text',text:`error occured. maybe the command isn't exist`})
            console.log(error)
        }
        
    }
    }


}