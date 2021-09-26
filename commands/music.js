var {IDS}=require('../util');
module.exports={
    description:"send audio file based on the youtube search",
    usage(SenderID){return`${IDS[SenderID].PREFIX}music <keyword> <optional parameter(can be leaved blank)>\noptional parameter: -q <bitrate>\nvalid bitrate are 48, 64, 70, 128, 160 and 256`},
    exec(event,client,SenderID,args){
        var keyword = args
        var bitrates = [48,64,70,128,160,256]
        let senderId
        function timeout(){
            let found
            if(found=="true"){
                return
            }else(
                client.replyMessage(event.replyToken,{type:'text',text:"not found \ntry to change the bitrate or keyword"}).catch(err=>{})
            );
        }
        if(event.source.groupId){
          senderId=event.source.groupId
        }else{
            senderId=event.source.userId
        }
        var bitrate =128
        if(args.indexOf("-q")!=-1){   
            var index = keyword.indexOf("-q");
            bitrate = parseInt(args[index+1])
            keyword[index]=""
            keyword[index+1]=""
            }
        if(!bitrates.includes(bitrate)||isNaN(bitrate)){
            client.replyMessage(event.replyToken,{type:'text',text:"bitrate should be 48, 64, 70, 128, 160, 256 and should be number"})
            return
        }
        var url
        var duration
        const ytdl = require('ytdl-core');
        const yts = require("yt-search");

        yts( keyword.join("")).then(data=>{
        ytdl.getInfo(data.videos[0].url).then(data=>{
        var audiobitrate 
        var formats =data.formats
        var title = data.player_response.videoDetails.title
        
        formats.forEach(data => {
            if(data.audioBitrate==bitrate){
            audiobitrate=data.audioBitrate
            url=data.url
            duration=data.approxDurationMs
            client.replyMessage(event.replyToken,{type:'audio',originalContentUrl:url,duration:duration});
            client.pushMessage(senderId,{type:'text',text:`${title} (${audiobitrate}kbps)`});
            return
            }})
        setTimeout(timeout,15000);
        }
        
        )})
        ;
},
opt(event,client,SenderID,args){}
}