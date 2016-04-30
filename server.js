const Botkit = require('botkit')

const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN
const port = process.env.PORT

if (!accessToken) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is required but missing')
if (!verifyToken) throw new Error('FACEBOOK_VERIFY_TOKEN is required but missing')
if (!port) throw new Error('PORT is required but missing')

const controller = Botkit.facebookbot({
  access_token: accessToken,
  verify_token: verifyToken
})

const bot = controller.spawn()

controller.setupWebserver(port, function (err, webserver) {
  if (err) return console.log(err)
  controller.createWebhookEndpoints(webserver, bot, function () {
    console.log('Ready')
  })
})

controller.hears(['hello', 'hi'], 'message_received', function (bot, message) {
  bot.reply(message, 'Namaste! Sure let\'s check the schedule for you..')
  bot.reply(message, {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'Schedule for..',
        buttons: [
          {
            type: 'postback',
            title: 'Today',
            payload: 'show_today'
          },
          {
            type: 'postback',
            title: 'This week',
            payload: 'show_week'
          },
          {
            type: 'postback',
            title: 'Workshops',
            payload: 'show_workshops'
          }
        ]
      }
    }
  })
})

controller.on('facebook_postback', function (bot, message) {
  switch (message.payload) {
    case 'show_today':
      bot.reply(message, {
        attachment: {
          type: 'image',
          payload: {
            url: 'https://media.giphy.com/media/5xaOcLT4VhjRfudPcS4/giphy.gif'
          }
        }
      })
      break
    case 'show_week':
      bot.reply(message, {
        attachment: {
          type: 'image',
          payload: {
            url: 'https://media.giphy.com/media/3o7ZeL5FH6Ap9jR9Kg/giphy.gif'
          }
        }
      })
      break
    case 'show_workshops':
      bot.reply(message, {
        attachment: {
          type: 'image',
          payload: {
            url: 'http://i.giphy.com/8OUdE03f3Nauc.gif'
          }
        }
      })
      break
  }
})
