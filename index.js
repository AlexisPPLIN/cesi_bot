const Discord = require('discord.js');
const env = require('./config.json');
const client = new Discord.Client();
const db = require('./models/index');
const PeriodPlanner = require('./classes/PeriodPlanner');

var fs = require("fs")
var vm = require('vm')

vm.runInThisContext(fs.readFileSync("./embed/embed_confirmation_presence_MP.js"))
vm.runInThisContext(fs.readFileSync("./embed/embed_presence_jour.js"))

client.once('ready', () => {
	console.log('Ready!');
	//Check if the channel id is correct
	client.channels.fetch(env.presence_channel_id)
		.then((channel) => {
			if(channel.type !== "text") throw new Error("Channel given is not a text channel")
			console.log("Presence channel detected !");

			//Initialize PeriodPlanner
			let planner = new PeriodPlanner(channel);
			planner.importModel("default.json",() => {
				//Model imported
				let start = new Date();
				start.setSeconds(start.getSeconds() + 5);
				console.log("start : "+start);

				let end = new Date();
				end.setSeconds(end.getSeconds() + 50);
				console.log("end : "+end);

				planner.registerPeriode(start,end);
			});

		})
		.catch(() => {
			throw new Error("404 : Presence channel not found, check id in config");
		});

});

client.login(env.token);

client.on('message', message => {
	var MessageMinuscule = message.content.toLowerCase()//afin de pas prendre en compte les majuscule ou minuscule 
	console.log("test3");
	if (message.author.id !== client.user.id)//pour ignorer les msg du bot
	{
		console.log("test2");
		if (MessageMinuscule === '!help') {
			//afficher la liste des comande dans un embed
		}


		if (MessageMinuscule === '!présent' || MessageMinuscule === '!présente' || MessageMinuscule === '!present' || MessageMinuscule === '!presente') {


			//modification dans la bd avec l'heure et en fct de l'id



			//supresion message
			embed_confirmation_presence_mp.embed.fields[0].value = message.author.username;//modifie le nom /* mettre le nom de la base de donne en fct de l'id

			message.delete();//supprime le msg
			//envoi mp confirmation

			message.author.send({ embed: embed_confirmation_presence_mp.embed });
		}





		if (MessageMinuscule === '!liste élève') {

		}





		if (MessageMinuscule.slice(0, 10) == '!présences') {//si message commence par !présences
			var etudiant = ['Alexis', 'justin'];
			
			var ListeEtudiantChaine = "";
			for (let i = 0; i < etudiant.length; i++) {
				ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + etudiant[i] + "\n";
			}

			embed_presence_jour.embed.fields[0].value=ListeEtudiantChaine;
			message.channel.send({ embed: embed_presence_jour.embed });
		}


		if (MessageMinuscule.slice(0, 6) == '!cours') {//si message commence par !cours
		}

		if (MessageMinuscule.slice(0, 5) == '!link') {//si message commence par !link
		}


		if (MessageMinuscule.slice(0, 7) == '!delete') {//si message commence par !delete
		}

	}

});

