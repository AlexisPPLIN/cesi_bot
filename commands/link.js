const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');

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
    description: lang.get('cmd_link_desc'),
    args: true,
    usage: lang.get('cmd_link_usage'),
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