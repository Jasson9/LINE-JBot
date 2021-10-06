# LINE-JBot
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

LINE-Jbot is a simple LINE bot coded in Node.js(javascript) with few features like Music downloader, images search and chatbot.
you can play Jumble Words and hangman also with the bot

deploy it easily using heroku button 👆👆👆 or fork the repo and deploy it by yourself.

## requirements:
- LINE channel secret [refer to LINE API Documentation](https://developers.line.biz/en/glossary/#channel-secret)
- LINE channel access token [refer to LINE API Documentation](https://developers.line.biz/en/reference/messaging-api/#channel-access-token)
- Webhook endpoint [refer to LINE Messaging API Documentation](https://developers.line.biz/en/reference/messaging-api/#webhooks) and use webhook option should be turned on

## webhook endpoint 
* for heroku : https://(your app name).herokuapp.com/webhook
* for self deployment : https://(your domain)/webhook

## note  
- webhook endpoint should be https with valid certificate
- bot's response mode should be bot you can change it at [LINE Official Account manager](https://manager.line.biz/) setting
- for self deployment you can change default bot settings at [config.json](./config.json)

invite JBot to your LINE chat using this link : [here](https://line.me/R/ti/p/%40188fmzkm)
