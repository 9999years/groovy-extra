const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content.startsWith('-p')) {
        message.reply('oh? you wanna play music? you wanna play a little music in my little discord server? you think you deserve to hear music? good. i love you.');
    }
});

client.login(process.env.BOT_TOKEN); // BOT_TOKEN is the Client Secret
