const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');
const env = require('../config.json');

module.exports = {
    name: 'help',
    description: lang.get('cmd_help_desc'),
    aliases: ['commands'],
    usage: lang.get('cmd_help_usage'),
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push(lang.get('cmd_help_list'));
            data.push(commands.map(command => command.name).join(', '));
            data.push(lang.get('cmd_help_command_1')+' '+env.prefix+' '+lang.get('cmd_help_command_2'));

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(lang.get('cmd_help_dm'));
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(lang.get('cmd_help_dm_error'));
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(lang.get('cmd_help_not_valid'));
        }

        // Generate help embed
        let command_name = env.prefix+command.name;
        let aliases = command.aliases.map(function(s){
            return "`"+env.prefix+s+"`";
        }).join(', ')
        let usage = "`"+command_name+" "+command.usage+"`";
        let countdown = (command.cooldown || 3)+" seconde(s)"
        let embed = {
            "title": lang.get('cmd_help_embed_title')+" `"+command_name+"`",
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
                    "name": lang.get('cmd_help_embed_aliases'),
                    "value": aliases
                },
                {
                    "name": lang.get('cmd_help_embed_usage'),
                    "value": usage
                },
                {
                    "name": lang.get('cmd_help_embed_countdown'),
                    "value": countdown
                }
            ]
        };

        message.channel.send( { embed: embed });
    },
};