const yandeximages = require("yandex-images");
var {IDS}=require('../util');
const axios = require("axios");
const pictformats=[".png",".jpeg",".jpg",".gif",".webp"]
module.exports={
  description:"send image to chat",
  usage(SenderID){
    return`\n${IDS[SenderID].PREFIX}image <keyword> <optional parameters(can be leave blank)>\n\noptional parameters: -e <search engine>\navailable search engine: google and yandex`
    },
  exec(event,client,SenderID,args){
    var ID = IDS[SenderID]
    if(!args[0]){client.replyMessage(event.replyToken,{type:'text',text:"no keyword"});return}
          var keyword =args   
          var imgurl
          var overrideengine
          if(keyword.indexOf("-e")!=-1){
            var index = keyword.indexOf("-e");
            overrideengine = keyword[index+1]
            keyword[index]=""
            keyword[index+1]=""
            }
          keyword =  keyword.join("  ");
          var engine = overrideengine? overrideengine:ID.SEARCH_ENGINE
          if(engine=="yandex"||engine=="google"){
          }else{
            client.replyMessage(event.replyToken,{type:'text', text:"search engine not available"});
          }
          
          try{
          if(engine=="yandex"){
          yandeximages.Search(keyword, false, function(url){
            imgurl=url
            client.replyMessage(event.replyToken,{type:'image', originalContentUrl:imgurl,previewImageUrl:imgurl});
          })}
          if(engine=="google"){
              const search_query = args.join("+").toLowerCase();
              var formatted_search_url = `https://images.google.com/search?tbm=isch&q=${search_query}`;
                axios.get(encodeURI(formatted_search_url), {
                  params: null,
                  headers: {
                    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
                    "Referer": "https://www.google.com/images",
                    "Accept": "text/html",
                    "Accept-Language": "en-US",
                    "Accept-Encoding": "gzip",
                    "Upgrade-Insecure-Requests": 1
                  },
                }).then((res) => {
                  const image_search_regex = /\["(http.*?)",(\d+),(\d+)]/g
                  const data = res.data;
                  let index = 0;
                  let parsed_data = image_search_regex.exec(data);
                  while (parsed_data != null && index != 2) {
                      var idx
                      var link = parsed_data[1]
                      var i = link.replace("https://","").indexOf("/")
                      var unhttps = link.replace("https://","")
                      var website = unhttps.slice(0,i)
                      if(link.replace("https://","").lastIndexOf(website)>website.length){
                        link="https://"+link.slice(link.lastIndexOf(website))
                      }
                      imgurl=link
                      pictformats.forEach(format=>{
                      if(link.includes(format)){
                        idx = link.indexOf(format)
                        imgurl=link.slice(0,idx+format.length);
                      }})  
                    index++
                    parsed_data = image_search_regex.exec(data);
                  }
                  client.replyMessage(event.replyToken,{type:'image', originalContentUrl:imgurl,previewImageUrl:imgurl});
                })
            }
          }  
          catch(err){if(err){
            console.log(err)}}
      },opt(){return}
  }