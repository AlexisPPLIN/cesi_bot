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
    name: "delete",
    description: "supprime l’élève dans la liste des élève qui est dans base de donnée",
    args: true,
    usage: "<Prenom:Prenom> <IdDiscord:IdDiscord>",
    execute(message, args) {
        
        
        try {
            var PrenomCommande = args[0];
console.log(args);
            var IdDiscordCommande = args[1];
console.log(IdDiscordCommande);
            db.Utilisateur.findOne({ where: { id_discord: IdDiscordCommande } }).then(Utilisateur => {

                return Utilisateur.destroy();
            });
            



        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}