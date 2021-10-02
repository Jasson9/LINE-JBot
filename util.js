const fs =require('fs')
let config;
let IDS = require('./IDSconfig.json');
function write(){
  var data =  JSON.stringify(IDS)
  fs.writeFileSync("./IDSconfig.json",data);
  return
}
try {
    config = require("./config.json");
  } catch (error) {
    config = null;
  }
setInterval(write,10000)
exports.IDS = IDS;
exports.PREFIX = process.env.PREFIX||config.PREFIX;
exports.SEARCH_ENGINE = process.env.SEARCH_ENGINE||config.search_engine;
exports.CHANNEL_SECRET =process.env.CHANNEL_SECRET||config.secret;
exports.CHANNEL_ACCESS_TOKEN = process.env.ACCESS_TOKEN||config.accesstoken;
exports.BOTNAME = process.env.BOTNAME||config.botName;
exports.CBSTATUS= process.env.CHATBOT||config.chatbot;