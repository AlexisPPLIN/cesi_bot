embed_presence_jour = require(__dirname + '/../embed\\embed_presence_jour.js');

function presences(message, client, MessageMinuscule, db, STATUT) {



    var dateActuel = new Date();

    //date debut periode
    var datePeriodeDebut = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 0, 0, 1);

    //date fin periode
    var datePeriodeFin = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 23, 59, 59);


    db.Presence.findAll({
        where: {
            '$Periode.debut$': {
                [db.Sequelize.Op.between]: [datePeriodeDebut, datePeriodeFin]
            }

        },
        attributes: ['date_arrive'],
        include: [{
            model: db.Statut,
            attributes: ['id', 'nom'],
            required: true,
            right: true
        }, {
            model: db.Periode,
            attributes: ['debut', 'fin'],
           
            required: true,
            right: true,

        }, {
            model: db.Utilisateur,
            attributes: ['prenom', 'nom', 'id_discord'],
            where: { RoleId: 1 },
            required: true,
            right: true

        }]

    }).then(Presence => {


        var ListeEtudiantChaine = "";


        var dateActuel = new Date();


        var ListePresenceMatinChaine = "";
        var ListePresenceApremChaine = "";



        for (var i = 0; i < Presence.length; i++) {
            ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + Presence[i].Utilisateur.nom + " " + Presence[i].Utilisateur.prenom + "\n";


            var datedebut = new Date(Presence[i].Periode.debut);
    
                    if (datedebut < 13) {

                        if (Presence[i].Statut.id == STATUT.RETARD) {
                            ListePresenceMatinChaine = ListePresenceMatinChaine + "✅ (⏰12min)";
                        }
                        else if (Presence[i].Statut.id == STATUT.PRESENT) {
                            ListePresenceMatinChaine = ListePresenceMatinChaine + "✅";
                        }
                        else if (Presence[i].Statut.id == STATUT.EN_ATTENTE) {
                            ListePresenceMatinChaine = ListePresenceMatinChaine + "❔";
                        }
                        else if (Presence[i].Statut.id == STATUT.ABSENT) {
                            ListePresenceMatinChaine = ListePresenceMatinChaine + "❌";
                        }

                        ListePresenceMatinChaine = ListePresenceMatinChaine + "\n";


                   
                    }
       




        }

        console.log("test:" + ListePresenceApremChaine);
        embed_presence_jour.embed.fields[1].value = ListePresenceMatinChaine;
        embed_presence_jour.embed.fields[2].value = ListePresenceApremChaine;
        embed_presence_jour.embed.fields[0].value = ListeEtudiantChaine;
        message.channel.send({ embed: embed_presence_jour.embed });





    })


}
module.exports = presences;