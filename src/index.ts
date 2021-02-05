// const Discord = require('discord.js')
import * as Discord from 'discord.js'

const client = new Discord.Client()

client.on('ready', () => {
    console.log('Ready!')
    client.user.setActivity("100 gecs", {type: "LISTENING"})
        .catch(console.error)
})

client.on('message', message => {
    if (message.content.startsWith('-p')) {
        message.reply('oh? you wanna play music? you wanna play a little music in my little discord server? you think you deserve to hear music? good. i love you.')
    } else if (message.content.indexOf('vibe check') !== -1) {
        message.reply('great vibes!')
    } else if (message.mentions.users.first().id == client.user.id) {
        message.reply("hey. can\'t talk right now, sorry. tbh i didn't even bother to read the message. smell ya later")
    }
})

client.login(process.env.BOT_TOKEN) // BOT_TOKEN is the Client Secret

