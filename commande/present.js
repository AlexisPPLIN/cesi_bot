/*
embed_confirmation_presence_mp =require(__dirname +'/../embed/embed_confirmation_presence_MP.js');

function present(message, client ,MessageMinuscule,db,STATUT) 
            {
            //modification dans la bd avec l'heure et en fct de l'id
			var dateActuel = new Date();



if(dateActuel.getDate() <10)
{
var jourActuelChaine="0"+dateActuel.getDate();
}
else{
	var jourActuelChaine=dateActuel.getDate();
}


if((dateActuel.getMonth()+1) < 10)
{
var moisActuelChaine="0"+(dateActuel.getMonth()+1);
}
else{
	var moisActuelChaine=(dateActuel.getMonth()+1);
}





			if (dateActuel.getHours() < 13) {
				//date debut periode
				var datePeriodeDebut = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 8, 45, 0);

				//date fin periode
				var datePeriodeFin = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 12, 15, 0);
				
				
				var heureAfficher =  jourActuelChaine + "/" +moisActuelChaine+"/"+dateActuel.getFullYear() +" - Matin";


				if ((dateActuel.getHours() == 8 && dateActuel.getMinutes() > 45) || dateActuel.getHours() > 8) {
					var statutid = STATUT.RETARD;

				}
				else {
					var statutid = STATUT.PRESENT;
				}

			}
			else {
				//date debut periode

				var datePeriodeDebut = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 13, 30, 0);
				//date fin periode

				var datePeriodeFin = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 17, 0, 0);




				var heureAfficher =  jourActuelChaine+ "/" +moisActuelChaine+"/"+dateActuel.getFullYear() +" - Après-midi";
				




			}

			//compte nombre ligne
			db.Periode.count({
				where: { dateActuel:  {
					[db.Sequelize.Op.between]: [pre_debut, fin]
				} },
				attributes: ['id']
			}).then(c => {
				console.log("il y a " + c + " ligne")
				//si il y a un resultat alors
				if (c != 0) {

					// cherche l'id de la periode
					db.Periode.findOne({
						where: { debut:  {
							[db.Sequelize.Op.between]: [datePeriodeDebut, datePeriodeFin]
						} },
						attributes: ['id']
					}).then(Periode => {
						console.log("periode trouver: id n°" + Periode.id);


						db.Utilisateur.count({ //afin de determiner si il fait parti de la liste des etudiant
							where: { id_discord: message.author.id },
							attributes: ['id']
						}).then(countUtilisateur => {
							if (countUtilisateur != 0) {
								//cherche l'id de l'user
								db.Utilisateur.findOne({
									where: { id_discord: message.author.id },
									attributes: ['id', 'prenom', 'nom', 'RoleId']
								}).then(Utilisateur => {


									db.Presence
										.findOrCreate({ where: { UtilisateurId: Utilisateur.id, StatutId: statutid, PeriodeId: Periode.id }, defaults: { UtilisateurId: Utilisateur.id, StatutId: statutid, PeriodeId: Periode.id, date_arrive: dateActuel } })
										.then(([Presence, created]) => {

											if (created) {
												embed_confirmation_presence_mp.embed.fields[0].value = Utilisateur.nom + " " + Utilisateur.prenom //modifie le nom /* mettre le nom de la base de donne en fct de l'id
												embed_confirmation_presence_mp.embed.description= heureAfficher
												embed_confirmation_presence_mp.embed.timestamp=dateActuel;
												message.delete();//supprime le msg
												//envoi mp confirmation

												message.author.send({ embed: embed_confirmation_presence_mp.embed });
											}
											else {
												message.author.send("erreur vous ete deja pointer");


											}
										})

								})
							}
							else { message.author.send("erreur vous ete pas dans la liste des etudiant"); }
						});


						//supresion message
					})

				}
				else {
					message.author.send("erreur vous avez pas cours");
				}


			});
			message.delete();//supprime le msg
		}
		


		module.exports = present;*/