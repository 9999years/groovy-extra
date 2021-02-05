const Discord = require('discord.js')

const client = new Discord.Client()

client.on('ready', () => {
    console.log('I am ready!')
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

botUsers = {}

client.guilds.cache
    .each(guild => {
        if (guild.available) {
            guild.fetchIntegrations({includeApplications: true})
                .then(integrations =>
                    integrations.each(integration => {
                        if (integration.application) {
                            if (integration.application.bot) {
                                botUsers[guild.id][integration.id][integration.application.id] = integration.application.bot.user
                            }
                        }
                    }))
        }
    })

client.fetchApplication()
    .then(.user.setActivity("100 gecs", {
    url: "https://github.com/9999years/groovy-extra/",
    type: "LISTENING"
})

