const PresenceSupervisor = require('../classes/PresenceSupervisor');

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')
embed_confirmation_presence_mp = require(__dirname + '/../embed/embed_confirmation_presence_MP.js');


const db = require('..\\models\\index');
const STATUT = {
	RETARD: 1,
	PRESENT: 2,
	EN_ATTENTE: 3,
	ABSENT: 4
};



module.exports = {
    name: "liste",
    description: "affiche la liste des élève de la promo dans la base de donnée",
    args: false,
    usage: "",
    execute(message, args) {
        //Pass the arguments to the PresenceSupervisor and return errors if needed
     try {
            

        db.Utilisateur.findAll({ where: { RoleId: '1' } }).then(Utilisateur => {
            var ListeEtudiantChaine = "";
            for (let i = 0; i < Utilisateur.length; i++) {
                ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + Utilisateur[i].nom + " " + Utilisateur[i].prenom + " <@" + Utilisateur[i].id_discord + "> \n";
            }
            embed_liste_etudiant.embed.fields[0].value = ListeEtudiantChaine;
            message.channel.send({ embed: embed_liste_etudiant.embed });
    
        })



        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}