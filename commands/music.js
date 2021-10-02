const ytdl = require('ytdl-core');
const yts = require("yt-search");
module.exports={
    description:"send audio file based on the youtube search or even youtube video url",
    usage(prefix){return`${prefix}music <keyword> <optional parameter(can be leaved blank)>\noptional parameter: -q <bitrate>\nvalid bitrate are 48, 64, 70, 128, 160 and 256`},
    exec(event,client,SenderID,args){
        var keyword = args
        var bitrates = [48,64,70,128,160,256]
        function timeout(){
            let found
            if(found=="true"){
                return
            }else(
                client.replyMessage(event.replyToken,{type:'text',text:"not found \ntry to change the bitrate or keyword"}).catch(err=>{})
            );
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
        yts( keyword.join("")).then(data=>{
        ytdl.getInfo(data.videos[0].url).then(data=>{
        var formats =data.formats
        var title = data.player_response.videoDetails.title
        
        formats.forEach(data => {
            if(data.audioBitrate==bitrate){
            client.replyMessage(event.replyToken,{type:'audio',originalContentUrl:data.url,duration:data.approxDurationMs});
            client.pushMessage(SenderID,{type:'text',text:`${title} (${data.audioBitrate}kbps)`});
            return
            }})
        setTimeout(timeout,15000);
        }
        
        )})
        ;
}}