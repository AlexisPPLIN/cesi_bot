const PresenceSupervisor = require('../classes/PresenceSupervisor');

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')
embed_presence_jour = require(__dirname + '/../embed\\embed_presence_jour.js');


const db = require('..\\models\\index');
const STATUT = {
	RETARD: 1,
	PRESENT: 2,
	EN_ATTENTE: 3,
	ABSENT: 4
};



module.exports = {
    name: "presences",
    aliases: ['viewperiode ','présences'],
    description: "envoi un mp à l’intervenant avec tous les absent, les present et les retard",
    args: true,
    usage: "!présences [date] [matin/aprem]",
    execute(message, args) {
        
     try {
            
   


        var dateActuel = new Date();

        //date debut periode
        var datePeriodeDebut = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 0, 0, 1);
    
        //date fin periode
        var datePeriodeFin = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 23, 59, 59);
    
        db.Utilisateur.findAll({
            where: { RoleId: 1 },
            attributes: ['id', 'prenom', 'nom', 'RoleId']
        }).then(Utilisateur => {
    
var listePrenomEtudiant=[];
var listeNomEtudiant=[];
for (var i = 0; i < Utilisateur.length; i++) 
{
    listePrenomEtudiant.push(Utilisateur[i].prenom)
    listeNomEtudiant.push(Utilisateur[i].nom)

}
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
    
            var ListePresencePeriode1 = "";
            var ListePresencePeriode2 = "";
    
            for (var i = 0; i < Presence.length; i++) {
                ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + Presence[i].Utilisateur.nom + " " + Presence[i].Utilisateur.prenom + "\n";
    
    
                var datedebut = new Date(Presence[i].Periode.debut);
    
    
                console.log(Presence[i].Statut.nom);

                        if (datedebut.getHours() < 13) {
    
                            if (Presence[i].Statut.id == STATUT.RETARD) {
                                ListePresencePeriode1 = ListePresencePeriode1 + "✅ (⏰12min)";
                            }
                            else if (Presence[i].Statut.id == STATUT.PRESENT) {
                                ListePresencePeriode1 = ListePresencePeriode1 + "✅";
                            }
                            else if (Presence[i].Statut.id == STATUT.EN_ATTENTE) {
                                ListePresencePeriode1 = ListePresencePeriode1 + "❔";
                            }
                            else if (Presence[i].Statut.id == STATUT.ABSENT) {
                                ListePresencePeriode1 = ListePresencePeriode1 + "❌";
                            }
    
                            ListePresencePeriode1 = ListePresencePeriode1 + "\n";
    
    
                        } 

            }
            //console.log("test:" + ListePresencePeriode2);
          //  embed_presence_jour.embed.fields[1].value = ListePresencePeriode1;
           // embed_presence_jour.embed.fields[2].value = ListePresencePeriode2;
            embed_presence_jour.embed.fields[0].value = ListeEtudiantChaine;
            message.channel.send({ embed: embed_presence_jour.embed });
        })

        





    })

        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}