const env = require('../config.json');

module.exports = {
    name: 'help',
    description: "Liste toutes les commandes ou donne les infos d'une commande",
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${env.prefix}help [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        // Generate help embed
        let command_name = env.prefix+command.name;
        let aliases = command.aliases.map(function(s){
            return "`"+env.prefix+s+"`";
        }).join(', ')
        let usage = "`"+command_name+" "+command.usage+"`";
        let countdown = (command.cooldown || 3)+" seconde(s)"
        let embed = {
            "title": "Aide de la commande `"+command_name+"`",
            "description": command.description,
            "url": "https://discordapp.com",
            "color": 10071592,
            "author": {
                "name": "CESI Bot",
                "url": "https://discordapp.com",
                "icon_url": "https://puu.sh/G2gn6/c26897ba03.png"
            },
            "fields": [
                {
                    "name": "Aliases",
                    "value": aliases
                },
                {
                    "name": "Utilisation",
                    "value": usage
                },
                {
                    "name": "Temps d'attente avant nouvelle utilisation",
                    "value": countdown
                }
            ]
        };

        message.channel.send( { embed: embed });
    },
};