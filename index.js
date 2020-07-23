const Discord = require('discord.js');
const env = require('./config.json');
const client = new Discord.Client();
const db = require('./models/index');

const fs = require("fs");
const vm = require('vm');
const embed_declaration_presence = require('.\\embed\\embed_declaration_presence.js');
const embed_fin_declaration_presence = require('.\\embed\\embed_fin_declaration_presence.js');

const Queue = require('bull');
let embedQueue = new Queue('embed', 'redis://'+env.redis_host+':'+env.redis_port);

// Getting every commands in the 'commands' folder
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}


//vm.runInThisContext(fs.readFileSync("./embed/embed_confirmation_presence_MP.js"))
//vm.runInThisContext(fs.readFileSync("./embed/embed_presence_jour.js"))

const present = require('.\\commande\\present.js');
const liste_eleve = require('.\\commande\\liste_eleve.js');
const presences = require('.\\commande\\presences.js');
const link = require('.\\commande\\link.js');
const deleteEtudiant = require('.\\commande\\delete.js');

const STATUT = {
	RETARD: 1,
	PRESENT: 2,
	EN_ATTENTE: 3,
	ABSENT: 4
};

client.once('ready', () => {
	console.log('Ready!');

	// Queue process to send embed in queue with the channel provided
	embedQueue.process(async (job,done) =>{
		console.log("Sending embed to channel "+job.data.channel_id);
		client.channels.fetch(job.data.channel_id)
			.then((channel) => {
				channel.send({embed: job.data.embed});
				done();
			})
	});
});

client.login(env.token);

client.on('message', message => {
	// Get message command and arguments
	if (!message.content.startsWith(env.prefix) || message.author.bot) return;


	const args = message.content.slice(env.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
	|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

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

	let MessageMinuscule = message.content.toLowerCase()//afin de pas prendre en compte les majuscule ou minuscule

	if (message.author.id !== client.user.id)//pour ignorer les msg du bot
	{

		if (MessageMinuscule === '!help') {
			//afficher la liste des comande dans un embed
		}


		if (MessageMinuscule === '!présent' || MessageMinuscule === '!présente' || MessageMinuscule === '!present' || MessageMinuscule === '!presente') {
			present(message, client ,MessageMinuscule,db,STATUT);
		}


		if (MessageMinuscule === '!liste élève') {
			liste_eleve(message, client ,MessageMinuscule,db,STATUT);
		}


		if (MessageMinuscule.slice(0, 10) === '!présences' || MessageMinuscule.slice(0, 10) === '!presences'  ) {//si message commence par !présences
			presences(message, client ,MessageMinuscule,db,STATUT);
		}


		if (MessageMinuscule.slice(0, 6) === '!cours') {//si message commence par !cours
		}


		if (MessageMinuscule.slice(0, 5) === '!link') {//si message commence par !link
			link(message, client ,MessageMinuscule,db,STATUT);
		}


		if (MessageMinuscule.slice(0, 7) == '!delete') {//si message commence par !delete
			deleteEtudiant(message, client ,MessageMinuscule,db,STATUT);
		}

	}

});

