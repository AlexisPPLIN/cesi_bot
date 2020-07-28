const appRoot = require('app-root-path');

const fs = require("fs");
const Discord = require('discord.js');
const env = require(appRoot+'/config.json');
const client = new Discord.Client();
const lang = require(appRoot + '/lang/Language');

const PresenceSupevisor = require(appRoot+'/classes/PresenceSupervisor');

const Queue = require('bull');
let embedQueue = new Queue('embed', 'redis://'+env.redis_host+':'+env.redis_port);

// Getting every commands in the 'commands' folder
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(appRoot+'/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(appRoot+`/commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');

	// Queue process to send embed in queue with the channel provided
	embedQueue.process(async (job,done) =>{
		// Get the channel
		client.channels.fetch(job.data.channel_id)
			.then((channel) => {
				console.log("Sending embed to channel "+job.data.channel_id);
				// Check if the embed was the end
				if(job.data.end){
					PresenceSupevisor.setNoResponseStudentToAbsent(job.data.period_id,() => {
						channel.send({embed: job.data.embed});
						done();
					})
				}else{
					channel.send({embed: job.data.embed});
					done();
				}
			})
	});
});

client.login(env.token);

client.on('message', message => {
	// Get message command and arguments
	if (!message.content.startsWith(env.prefix) || message.author.bot) return;

	//Check server

	if(message.channel.type !== "dm"){
		let guild_id = message.guild.id;
		if(guild_id !== env.server_id){
			// Not correct server
			message.channel.send(lang.get('not_correct_server'))
			return;
		}
	}

	const args = message.content.slice(env.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
	|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	//Check if the command is allowed in DM
	if(message.channel.type === "dm" && !command.allowed_in_dm){
		message.channel.send(lang.get('not_allowed_in_dm'));
		return;
	}

	// Check if the command need arguments
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${env.prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	try{
		command.execute(message, args);
	}catch(error){
		console.log(error);
	}

});

