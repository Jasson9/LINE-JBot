
let config;

try {
    config = require("./config.json");
  } catch (error) {
    config = null;
  }

exports.IDS = IDS;
exports.PREFIX = process.env.PREFIX||config.PREFIX;
exports.SEARCH_ENGINE = process.env.SEARCH_ENGINE||config.search_engine;
exports.CHANNEL_SECRET =process.env.CHANNEL_SECRET||config.secret;
exports.CHANNEL_ACCESS_TOKEN = process.env.ACCESS_TOKEN||config.accesstoken;
exports.BOTNAME = process.env.BOTNAME||config.botName;
exports.CBSTATUS= process.env.CHATBOT||config.chatbot;