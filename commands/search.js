var {IDS}=require("../util")
const axios = require("axios")
const cheerio = require("cheerio");

const formatHtml = (data) => {
  return data
    /* Some garbage we don't need */
    .replace(/N6jJud MUxGbd lyLwlc/g, "")
    .replace(/YjtGef ExmHv MUxGbd/g, "")
    .replace(/MUxGbd lyLwlc aLF0Z/g, "")
    /* Renaming some classes in order to get consistent results. */
    .replace(/yDYNvb lEBKkf/g, "yDYNvb")
    .replace(/VwiC3b MUxGbd yDYNvb/g, "MUxGbd yDYNvb")
    .replace(/yUTMj MBeuO ynAwRc PpBGzd YcUVQe/g, "yUTMj MBeuO ynAwRc gsrt PpBGzd YcUVQe");
};
const selectors = {
  // Organic Search Results 
  title_selector: 'div[class="yUTMj MBeuO ynAwRc gsrt PpBGzd YcUVQe"]',
  description_selector: 'div[class="MUxGbd yDYNvb"]',
  url_selector: 'a.C8nzq.BmP5tf'}

function search (query, options = {  page: 0, additional_params: null }) {
  const search_query = query.trim().split(/ +/).join("+").toLowerCase();
  const formatted_search_url = encodeURI(`https://google.com/search?q=${search_query}&aqs=chrome..69i57.1685j0j4&client=ms-android-motorola-rev2&sourceid=chrome-mobile&ie=UTF-8&aomd=1&start=0`);
  
  return new Promise((resolve) => {
    axios.get(formatted_search_url, {
      params: options.additional_params,
      headers: {
        "User-Agent": 'Mozilla/5.0 (Linux; Android 10; moto g(8) play) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
        "Referer": "https://www.google.com/",
        "Accept": "text/html",
        "Accept-Language": "en-US,en",
        "Accept-Encoding": "gzip",
        "Upgrade-Insecure-Requests": 1
      }
    }).then((res) => {
      const data = formatHtml(res.data);
      const $ = cheerio.load(data);
      const final_data = { results: [] };
    
      // Organic search results
      const titles = $(selectors.title_selector).map((i, el) => {
        if (el.parent.attribs.style != '-webkit-line-clamp:2') // ignores ad titles
        return $(el.children).text().trim();
      }).get();
      const descriptions = $(selectors.description_selector).map((i, el) =>{
        if (el.parent.attribs.class != 'w1C3Le') // ignores ad descriptions
        return $(el).text().trim();
      }).get();
      const urls = $(selectors.url_selector).map((i, el) => $(el).attr('href')).get();
      
      correctFuzzyData(titles, descriptions, urls);
      
      final_data.results = titles.map((title, index) => {
        return { title : title || 'N/A', description: descriptions[index] || 'N/A', url: urls[index] || 'N/A'};
      });
      
      resolve(final_data);
    }).catch((err) => resolve({ error: err.message }));
  });
}

function correctFuzzyData (titles, descriptions, urls) {
  // Correcting wrongly parsed data.
  if (titles.length < urls.length && titles.length < descriptions.length) {
    urls.shift();
  } else if (urls.length > titles.length) {
    urls.shift();
  }

  const innacurate_data = descriptions.length > urls.slice(1).length ? false : true;
  
  urls.forEach((item, index) => {
    // Why YouTube? Because video results usually don't have a description.
    if (item.includes("m.youtube.com") && innacurate_data && urls.length > 1) {
      //debug('Removing malformed block containing the link: ' + item);

      urls.splice(index, 1);
      titles.splice(index, 1);
      index--;
    }
  });
}

module.exports={
  description:"search using google",
  usage(prefix){
      return `${prefix}search <keyword>`
      },
  exec(event,client,SenderID,args){
  var ID = IDS[SenderID]
  if(!args[0]){client.replyMessage(event.replyToken,{type:'text',text:"no keyword"})
              ;return}
  var keyword = args.join(" ")
  if(!ID.SEARCH.LANG){
    ID.SEARCH.LANG="en"
  } 
  var urls = []
  var titles = []
  var preview = []
  var descriptions = []
  var page
  async function start() {
    const options = {
      page: page||0, 
      additional_params: { 
        hl: ID.SEARCH.LANG 
      }
    }
const response = await search(keyword, options);
    for(var i = 0 ; i < 4 ; i++){
        urls.push(response.results[i].url)
        titles.push(response.results[i].title)
        descriptions.push(response.results[i].description)
        preview.push(i+1+'. '+response.results[i].title)
        preview.push(response.results[i].url+"\n")
    }
    client.replyMessage(event.replyToken,{type:'text',text:`${preview.join('\n')}`})
  }
  start();
  },set(event,client,SenderID,args){
    var ID = IDS[SenderID]
    var description =`available arguments :\nlanguange <languange>\nnote: (recomended to use 2 characters at languange ex:EN)`
    switch (args[0]) {
      case 'languange':
        if(!args[1]){
          client.replyMessage(event.replyToken,{type:'text',text:`languange not specified\ncurrent languange is ${ID.SEARCH.LANG}`})
          break
        }
        client.replyMessage(event.replyToken,{type:'text',text:`languange has been changed to ${args[1]}`})
        ID.SEARCH.LANG=args[1]
        break;
    
      default:
        client.replyMessage(event.replyToken,{type:'text',text:description})
        break;
    }

  }
  
  }