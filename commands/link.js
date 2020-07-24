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
    name: "link",
    description: "Ajoute l’élève dans la liste des élève qui est dans base.",
    args: true,
    usage: "“!link <nom élève> <prénom élève> <discord>”",
    execute(message, args) {
        //Pass the arguments to the PresenceSupervisor and return errors if needed
        let supervisor;
     try {
            
        NomCommande = args[0];
            
            var PrenomCommande = args[1];
                   
            var IdDiscordCommande =  args[2];
            
            db.Utilisateur
    .findOrCreate({ where: { id_discord: IdDiscordCommande }, defaults: { nom: NomCommande, prenom: PrenomCommande, RoleId: '1' } })
    .then(([Utilisateur, created]) => {


    })

       
        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}