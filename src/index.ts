import * as Discord from 'discord.js'
import * as Redis from 'ioredis'

const QUEUE_NAME = "groovy-queue"

class GroovyQueue {
    redis: Redis.Redis

    constructor() {
        this.redis = new Redis(process.env.REDIS_URL)
    }

    async add(track: string): Promise<number> {
        return this.redis.sadd(QUEUE_NAME, track)
    }

    async contains(track: string): Promise<boolean> {
        return this.redis.sismember(QUEUE_NAME, track)
            .then(boolOrNum => !!boolOrNum)
    }

    async remove(track: string): Promise<number> {
        return this.redis.srem(QUEUE_NAME, track)
    }

    async toArray(): Promise<Array<string>> {
        return this.redis.smembers(QUEUE_NAME)
    }
}

interface BotCommand {
    name: string
    description: string
    invoke: (message: Discord.Message, args: string[]) => void
}

function dispatchCommand(cmds: BotCommand[], message: Discord.Message) {
    const toks = message.content.split(/\s+/)
    toks.shift() // the @ mention
    const cmdName = toks.shift()
    for (const cmd of cmds) {
        if (cmdName === cmd.name) {
            cmd.invoke(message, toks)
            return
        }
    }
    message.reply("the available commands are:\n"
        + cmds.reduce(
            (acc, cmd) => acc + `• \`${cmd.name}\`: ${cmd.description}\n`,
            ""
        )
    )
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const groovy = new GroovyQueue()
const client = new Discord.Client()

const COMMANDS: BotCommand[] = [
    {
        name: "show",
        description: "Show all saved tracks. To save a track, just play it normally with `-play`.",
        invoke: (message: Discord.Message, args: string[]) => {
            message.react('👍')
            groovy.toArray()
                .then(tracks => {
                    message.reply(
                        "here's the tracks i remember:\n"
                        + tracks.reduce((acc, track) => acc + `• ${track}\n`, "")
                    )
                })
                .catch(reason => {
                    console.error(reason)
                    message.react('😒')
                })
        }
    },
    {
        name: "remove",
        description: "Remove a track.",
        invoke: (message, args) => {
            if (args.length == 1) {
                message.channel.send('uh you gotta tell me the track?')
                message.react('🙄')
            }

            const track = args.join(" ")

            if (groovy.contains(track)) {
                groovy.remove(track)
                message.react('😎')
            } else {
                message.channel.send('sorry idk that one 😕')
            }
        }
    },
    {
        name: "diagnosis",
        description: "🙂",
        invoke: (msg, _args) => {
            msg.channel.send("i diagnose you with: gross")
        }
    }
]

client.on('ready', () => {
    console.log('Ready!')
    client.user?.setActivity("100 gecs", {type: "LISTENING"})
        .catch(console.error)
})

client.on('message', message => {
    if (message.content.startsWith('-p ') || message.content.startsWith('-play ')) {
        // message.reply('oh? you wanna play music? you wanna play a little music in my little discord server? you think you deserve to hear music? good. i love you.')
        const track = message.content.replace(/^-p(lay)?\s+/, "")
        groovy.add(track)
        message.react('👍')
    } else if (message.content.toLowerCase().indexOf('vibe check') !== -1) {
        message.reply('great vibes!')
    } else if (message.mentions.users.first()?.id == client?.user?.id) {
        // message.reply('not reading all that shit sorry')
        try {
            dispatchCommand(COMMANDS, message)
        } catch (e) {
            console.log(e)
            message.react('😬')
        }
    } else if (message.content == 'hey evil groovy, play me some tunes') {
        message.reply('no')
    }
})

client.login(process.env.BOT_TOKEN) // BOT_TOKEN is the Client Secret
