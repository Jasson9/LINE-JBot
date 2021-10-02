var {IDS} = require('../util')

module.exports={
    description:`change bot's prefix for this bot`,
    usage(prefix){
        return `${prefix}prefix <new prefix>`
    },
    exec(event,client,SenderID,args){
        var ID = IDS[SenderID]
        if(!args[0]){
            client.replyMessage(event.replyToken,{type:'text',text:`new prefix not specified\ncurrent prefix is ${ID.PREFIX}`})
            return
        }
        if(args[0].length>1){
            client.replyMessage(event.replyToken,{type:'text',text:'prefix can be only one symbol or character or even number'})
            return
        }
        ID.PREFIX=args[0][0]
        client.replyMessage(event.replyToken,{type:'text',text:`prefix has been changed to ${ID.PREFIX}`})
    },
    set(event,client,SenderID,args){
        this.exec(event,client,SenderID,args)
      }

}