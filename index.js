const Discord = require('discord.js');
const env = require('./config.json');
const client = new Discord.Client();
const db = require('./models/index');

embed_declaration_presence = require('.\\embed\\embed_declaration_presence.js');
embed_fin_declaration_presence = require('.\\embed\\embed_fin_declaration_presence.js');


present = require('.\\commande\\present.js');
liste_eleve = require('.\\commande\\liste_eleve.js');
presences = require('.\\commande\\presences.js');
link = require('.\\commande\\link.js');
deleteEtudiant = require('.\\commande\\delete.js');
const STATUT = {
	RETARD: 1,
	PRESENT: 2,
	EN_ATTENTE: 3,
	ABSENT: 4
};

//var fs = require("fs")
//var vm = require('vm')
//vm.runInThisContext(fs.readFileSync(".\\embed\\embed_confirmation_presence_MP.js"));
//vm.runInThisContext(fs.readFileSync(".\\embed\\embed_presence_jour.js"));
//vm.runInThisContext(fs.readFileSync(".\\embed\\embed_declaration_presence.js"));
//vm.runInThisContext(fs.readFileSync(".\\embed\\embed_fin_declaration_presence.js"));
//vm.runInThisContext(fs.readFileSync(".\\embed\\embed_liste_etudiant.js"));
//vm.runInThisContext(fs.readFileSync(".\\commande\\present.js"));
//vm.runInThisContext(fs.readFileSync(".\\commande\\liste_eleve.js"));
//vm.runInThisContext(fs.readFileSync(".\\commande\\presences.js"));
//vm.runInThisContext(fs.readFileSync(".\\commande\\link.js"));
//vm.runInThisContext(fs.readFileSync(".\\commande\\delete.js"));



client.once('ready', () => {
	console.log('Ready!');
});

client.login(env.token);

client.on('message', message => {
	var MessageMinuscule = message.content.toLowerCase()//afin de pas prendre en compte les majuscule ou minuscule 

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


		if (MessageMinuscule.slice(0, 10) == '!présences' || MessageMinuscule.slice(0, 10) == '!presences'  ) {//si message commence par !présences
			presences(message, client ,MessageMinuscule,db,STATUT);
		}


		if (MessageMinuscule.slice(0, 6) == '!cours') {//si message commence par !cours
		}


		if (MessageMinuscule.slice(0, 5) == '!link') {//si message commence par !link
			link(message, client ,MessageMinuscule,db,STATUT);
		}


		if (MessageMinuscule.slice(0, 7) == '!delete') {//si message commence par !delete
			deleteEtudiant(message, client ,MessageMinuscule,db,STATUT);
		}

	}

});

