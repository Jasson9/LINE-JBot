const fs = require('fs');
const path = require("path");
var { IDS } = require('../util');
const data= fs.readFileSync(path.join(__dirname,"../","res","wordlist.txt"),"utf-8").toString()
const wordlist = data.split(',\r\n')
var CSID =  []
function check(characters){
var chars = characters
var results = []
wordlist.forEach(word=>{
    var arrword = word.split('')
    var length = arrword.length
    var k =0
    for(var i = 0 ; i<chars.length;i++){
       if(arrword.includes(chars[i])){
        arrword[arrword.indexOf(chars[i])]=""
       k++
    }}
    if(k>=length){
    results.push(word)
    }
})
return results
}

function generate(){
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    var num = Math.floor((Math.random()+2)*4)
    var characters = []
    for(var j = 0 ; j<num;j++){
    characters.push(alphabet[Math.floor(Math.random()*26)])
    }
return characters
}

module.exports={
    description:"play jumble words",
    usage(prefix){
        return `${prefix}jumble`
    },
    exec(event,client,SenderID,args){
    let ID=IDS[SenderID]
    if(!ID.JUMBLE.TIME){
        ID.JUMBLE.TIME=120
    }
    if(!ID.JUMBLE.SID){
        ID.JUMBLE.SID=undefined
    }
    if(args[0]=="stop"){
        if(ID.JUMBLE.SID==undefined){
            client.replyMessage(event.replyToken,{type:'text',text:"no session running"})
        }else{
            client.replyMessage(event.replyToken,{type:'text',text:"jumble has been stopped"})
            CSID.splice(CSID.indexOf(ID.JUMBLE.SID),1)
        ID.JUMBLE.NAMES=ID.JUMBLE.SCORE=ID.JUMBLE.WORDS=ID.JUMBLE.LEFTTIME=ID.JUMBLE.SID=undefined
        }
        return
    }
    if(CSID.includes(ID.JUMBLE.SID)){
        client.replyMessage(event.replyToken,{type:'text',text:"session is already running"});
        return
    }

    var characters =[]
    var results = []
    var SID=Math.floor(Math.random()*1000000)
    ID.JUMBLE.SID=SID
    CSID.push(SID);
    while(results.length<=60){
        characters = generate()
        results = check(characters)
    }
    
ID.JUMBLE.WORDS=results
client.replyMessage(event.replyToken,{type:'text',text:`form a valid word using these characters \n ${characters.join(' ')}\nyou have ${ID.JUMBLE.TIME} seconds \nscore:\n`})
var partimer = ID.JUMBLE.TIME*1/8
ID.JUMBLE.LEFTTIME = ID.JUMBLE.TIME

var start = setInterval((id=SenderID)=>{
    var chars = characters
    var ID = IDS[id]
    var message = []
    let tSID= parseInt(SID)
    if(!CSID.includes(tSID)){
        clearInterval(start)
        return
    }
    if(ID.JUMBLE.NAMES!=undefined){
        for(var i = 0; i < ID.JUMBLE.NAMES.length;i++ ){
            message.push(`- ${ID.JUMBLE.NAMES[i]}`)
            message.push(` = ${ID.JUMBLE.SCORE[i]} \n`)
        }}
    ID.JUMBLE.LEFTTIME = ID.JUMBLE.LEFTTIME - partimer
    if(ID.JUMBLE.LEFTTIME==0){
        clearInterval(start)
        client.pushMessage(id,{type:'text',text:`Time's up!\nhere is the final result:\nscore:\n${message.join('')}`})
        CSID.splice(CSID.indexOf(ID.JUMBLE.SID),1)
        ID.JUMBLE.NAMES=ID.JUMBLE.SCORE=ID.JUMBLE.WORDS=ID.JUMBLE.SID=ID.JUMBLE.LEFTTIME=undefined
        return
    }
        client.pushMessage(id,{type:'text',text:`form a valid word using these characters \n${chars.join(' ')}\n${ID.JUMBLE.LEFTTIME} seconds left\nscore:\n${message.join('')}`})
}      ,ID.JUMBLE.TIME*1000/8)
start
},

opt(event,client,SenderID,args){
    var ID = IDS[SenderID]
    var word = args[0].split('')
    if(CSID.includes(ID.JUMBLE.SID)&&ID.JUMBLE.WORDS.includes(args[0])){
    if(ID.JUMBLE.NAMES==undefined){
        ID.JUMBLE.NAMES=[]
    }
    if(ID.JUMBLE.SCORE==undefined){
        ID.JUMBLE.SCORE=[]
    }
        client.getProfile(event.source.userId)
        .then((profile) => {
            var name = profile.displayName.toString()
            if(!ID.JUMBLE.NAMES.includes(name)){
                ID.JUMBLE.NAMES.push(name)
                ID.JUMBLE.SCORE.push(word.length)
            }else{
                ID.JUMBLE.SCORE[ID.JUMBLE.NAMES.indexOf(name)]=ID.JUMBLE.SCORE[ID.JUMBLE.NAMES.indexOf(name)]+word.length
            }
            ID.JUMBLE.WORDS.splice(ID.JUMBLE.WORDS.indexOf(word.join('')),1)
            client.pushMessage(SenderID,{type:'text',text:`${name} ⭕ \n${word.join('')}(+${word.length} points)`})
        })  
    }
},

set(event,client,SenderID,args){
    var ID = IDS[SenderID]
    var description = `available arguments :\ntimer (integer/number)\n\nexample:\n${ID.PREFIX}setting jumble timer 120`
    switch (args[0]) {
        case 'timer':
            if(!args[1]){
                client.replyMessage(event.replyToken,{type:'text',text:`time not specified\ncurrent timer ${ID.JUMBLE.TIME}`})
                break
            }
            if(isNaN(args[1])){
                client.replyMessage(event.replyToken,{type:'text',text:'time can only be number (in seconds)'})
                break
            }else{
                client.replyMessage(event.replyToken,{type:'text',text:`jumble timer has been changed to ${args[1]} seconds`})
                ID.JUMBLE.TIME = args[1]
            }
            break;
    
        default:
            client.replyMessage(event.replyToken,{type:'text',text:description})
            break;
    }
}
}