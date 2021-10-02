var {IDS}=require("../util");
var CSID = []
const fs = require('fs');
const path = require("path")
const data= fs.readFileSync(path.join(__dirname,"../","res","wordlist.txt"),"utf-8").toString()
const wordlist = data.split(",")

module.exports={
description:"play hangman game",
usage(prefix){
    return `${prefix}hangman`
},
exec(event,client,SenderID,args){
var ID = IDS[SenderID]

if(args=="stop"){
    if(ID.HANGMAN.SID==undefined&&ID.HANGMAN.WORD==undefined){
    client.replyMessage(event.replyToken,{type:'text',text:'no hangman session is running'});  
    }else{
    CSID.splice(CSID.indexOf(ID.HANGMAN.SID),1)
    ID.HANGMAN.SID=undefined
    ID.HANGMAN.WORD=undefined
    client.replyMessage(event.replyToken,{type:'text',text:'hangman has been stopped'})}
    return
}
if(ID.HANGMAN.SID!=undefined){
    client.replyMessage(event.replyToken,{type:'text',text:'session is already running'});
    return
}

var wordId=Math.floor(Math.random()*wordlist.length)
var SID=Math.floor(Math.random()*1000000)
ID.HANGMAN.SID=SID
CSID.push(SID);
var word = wordlist[wordId].trimStart()
var order = []
var i =0
ID.HANGMAN.WORD=word

if(!ID.HANGMAN.TIME)
    {
    ID.HANGMAN.TIME=120
}

while (i<word.length) 
{
    order.push(i),i++
};
var show = "-".repeat(word.length).split('')

for (var k = order.length - 1; k > 0; k--) {
    var j = Math.floor(Math.random() * (k + 1));
    var temp = order[k];
    order[k] = order[j];
    order[j] = temp;}

function count(data){
    let counter = 0;
    for (let i = 0;i<data.length; i++) {
    if (data[i] == '-'){counter++};}
    return(counter)
}

function initshow(data){
    var length = data.length
    var add
    show[order[data.length-1]]=word[order[order.length-1]]
    if(length>=7)
    {
    add = length-7
    for(let i=0;i<add;i++)
    {
        show[order[order.length-2-i]]=word[order[order.length-2-i]]
    }
}
    return 
}
initshow(order)
client.replyMessage(event.replyToken,{type:"text",text:`guess this word and save this person \n${show.join('')} \n \n you have ${ID.HANGMAN.TIME} seconds`})

function run (id,order){
var check = JSON.stringify(id.HANGMAN.SID)
var time = parseInt(id.HANGMAN.TIME)
    setTimeout(() => { // 1/6 timer in seconds elapsed
        
    if(check==id.HANGMAN.SID){
    if(count(show)>2){
    show[order[0]]=word[order[0]]} 
    client.pushMessage(SenderID,{type:"text",text:`${time*5/6} seconds left! \n${show.join('')} \n \n \n / `})

        setTimeout(()=>{ // 2/6 timer in seconds elapsed
            
        if(check==id.HANGMAN.SID){
        if(count(show)>2){
        show[order[1]]=word[order[1]]} 
        client.pushMessage(SenderID,{type:"text",text:`${time*4/6} seconds left! \n${show.join('')} \n\n  \n / \\`})

            setTimeout(()=>{
                
            if(check==id.HANGMAN.SID){ // 3/6 timer inseconds elapsed
            if(count(show)>2){
            show[order[2]]=word[order[2]] }
            client.pushMessage(SenderID,{type:"text",text:`${time*3/6} seconds left! \n${show.join('')}\n\n  |\n / \\ `})

                setTimeout(()=>{
                    
                if(check==id.HANGMAN.SID){ // 4/6 timer in seconds elapsed
                if(count(show)>2){
                show[order[3]]=word[order[3]] }
                client.pushMessage(SenderID,{type:"text",text:`${time*2/6} seconds left! \n${show.join('')}\n\n /|\n / \\ `})
                
                    setTimeout(()=>{
                        
                    if(check==id.HANGMAN.SID){ // 5/6 timer in seconds elapsed
                    if(count(show)>2){
                    show[order[4]]=word[order[4]] }
                    client.pushMessage(SenderID,{type:"text",text:`${time*1/6} seconds left! \n${show.join('')}\n\n /|\\\n / \\ `})
                    
                        setTimeout(()=>{ //dead
                            
                        if(check==id.HANGMAN.SID){
                            client.pushMessage(SenderID,{type:'text',text:`owh no he's dead! \nthe answer is ${word} \n\n  |\n (X)\n /|\\\n / \\ `})
                            CSID.splice(CSID.indexOf(ID.HANGMAN.SID),1)
                            ID.HANGMAN.SID=undefined
                            ID.HANGMAN.WORD=undefined
   return
 }else{return}
},id.HANGMAN.TIME*1000/6)
}else{return}
},id.HANGMAN.TIME*1000/6)
}else{return}
},id.HANGMAN.TIME*1000/6)
}else{return}
},id.HANGMAN.TIME*1000/6)  
}else{return}
},id.HANGMAN.TIME*1000/6)
}else{return}
}, id.HANGMAN.TIME*1000/6);
return
}
run(ID,order)
},

opt(event,client,SenderID,args){
var ID = IDS[SenderID]
    if(!CSID.includes(ID.HANGMAN.SID)){return}
    else{
        if(ID.HANGMAN.WORD==args[0]){
        client.getProfile(event.source.userId)
            .then((profile) => {
            client.pushMessage(SenderID,{type:'text',text:`${profile.displayName} get the correct answer`})
            })
        CSID.splice(CSID.indexOf(ID.HANGMAN.SID),1)
        ID.HANGMAN.SID=undefined
        ID.HANGMAN.WORD=undefined
        }else{
        if(args.length>1){
            return
        }
        if(ID.HANGMAN.WORD!=args[0]){
            client.pushMessage(SenderID,{type:'text',text:"incorrect answer"})
        }
        }
    }
},set(event,client,SenderID,args){
    var ID = IDS[SenderID]
    var description = `available arguments :\ntimer (integer/number)\n\nexample:\n${ID.PREFIX}setting hangman timer 120`
    switch (args[0]) {
        case 'timer':
            if(args[1]==null){
                client.replyMessage(event.replyToken,{type:'text',text:`time not specified \ncurrent timer ${ID.HANGMAN.TIME}`})
                break
            }
            if(isNaN(args[1])){
                client.replyMessage(event.replyToken,{type:'text',text:'time can only be number (in seconds)'})
                break
            }else{
                client.replyMessage(event.replyToken,{type:'text',text:`hangman timer has been changed to ${args[1]} seconds`})
                ID.HANGMAN.TIME = args[1]
            }
            break;
    
        default:
            client.replyMessage(event.replyToken,{type:'text',text:description})
            break;
    }
}
}