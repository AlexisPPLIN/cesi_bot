const Discord = require('discord.js');
const env = require('./config.json');
const client = new Discord.Client();
const db = require('./models/index');

var fs = require("fs")
var vm = require('vm')

vm.runInThisContext(fs.readFileSync("./embed/embed_confirmation_presence_MP.js"))
vm.runInThisContext(fs.readFileSync("./embed/embed_presence_jour.js"))
vm.runInThisContext(fs.readFileSync("./embed/embed_declaration_presence.js"))
vm.runInThisContext(fs.readFileSync("./embed/embed_fin_declaration_presence.js"))
vm.runInThisContext(fs.readFileSync("./embed/embed_liste_etudiant.js"))

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


			//modification dans la bd avec l'heure et en fct de l'id


			db.Utilisateur.findOne({
				where: { id_discord: message.author.id },
				attributes: ['id', 'prenom', 'nom', 'RoleId']
			}).then(Utilisateur => {
				//console.log() message.author.username;
				embed_confirmation_presence_mp.embed.fields[0].value = Utilisateur.nom + " " + Utilisateur.prenom //modifie le nom /* mettre le nom de la base de donne en fct de l'id

				message.delete();//supprime le msg
				//envoi mp confirmation

				message.author.send({ embed: embed_confirmation_presence_mp.embed });
			})


			//supresion message

		}





		if (MessageMinuscule === '!liste élève') {

			db.Utilisateur.findAll({ where: { RoleId: '1' } }).then(Utilisateur => {
				var ListeEtudiantChaine = "";
				for (let i = 0; i < Utilisateur.length; i++) {
					ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + Utilisateur[i].nom + " " + Utilisateur[i].prenom + " <@" + Utilisateur[i].id_discord + "> \n";
				}
				embed_liste_etudiant.embed.fields[0].value = ListeEtudiantChaine;
				message.channel.send({ embed: embed_liste_etudiant.embed });

			})
		}





		if (MessageMinuscule.slice(0, 10) == '!présences') {//si message commence par !présences
			var etudiant = ['Alexis', 'justin'];

			var ListeEtudiantChaine = "";
			for (let i = 0; i < etudiant.length; i++) {
				ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + etudiant[i] + "\n";
			}

			embed_presence_jour.embed.fields[0].value = ListeEtudiantChaine;
			message.channel.send({ embed: embed_presence_jour.embed });
		}


		if (MessageMinuscule.slice(0, 6) == '!cours') {//si message commence par !cours
		}

		
		if (MessageMinuscule.slice(0, 5) == '!link') {//si message commence par !link
			commandeLink = message.content.substr(6);//mets la chaine sans le debut '!link'

			var NomCommande = commandeLink.slice(0, commandeLink.indexOf(' '))//prend la partie de la chaine a partir de 0 jusqua l'espace
			commandeLink = commandeLink.substr(commandeLink.indexOf(' ') + 1);//supprime le debut de la chaine

			var PrenomCommande = commandeLink.slice(0, commandeLink.indexOf(' ')) //prend la partie de la chaine a partir de 0 jusqua l'espace
			commandeLink = commandeLink.substr(commandeLink.indexOf(' '));
			var IdDiscordCommande = commandeLink.slice(4, commandeLink.indexOf('>'))//prend la partie de la chaine a partir de 1 jusqua la fin

			//console.log("essai:/" + NomCommande + "/   prenon:/" + PrenomCommande + "/  id:/" + IdDiscordCommande);

			db.Utilisateur
				.findOrCreate({ where: { id_discord: IdDiscordCommande }, defaults: { nom: NomCommande, prenom: PrenomCommande, RoleId: '1' } })
				.then(([Utilisateur, created]) => {

					console.log("test cree");
					console.log(Utilisateur.get({ plain: true }))
					console.log("user cree");
					console.log(created)
				})



		}


		if (MessageMinuscule.slice(0, 7) == '!delete') {//si message commence par !delete
			commandeLink = message.content.substr(6);//mets la chaine sans le debut '!link'

			var PrenomCommande = commandeLink.slice(0, commandeLink.indexOf(' ')) //prend la partie de la chaine a partir de 0 jusqua l'espace
			commandeLink = commandeLink.substr(commandeLink.indexOf(' '));
			var IdDiscordCommande = commandeLink.slice(4, commandeLink.indexOf('>'))//prend la partie de la chaine a partir de 1 jusqua la fin
			db.Utilisateur.findOne({where: { id_discord:IdDiscordCommande }}).then(Utilisateur => {

				return Utilisateur.destroy();
			  });

		}

	}

});

