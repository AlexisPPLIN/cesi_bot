const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');
embed_liste_etudiant = require(__dirname + '/../embed\\embed_liste_etudiant.js');

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
    name: "listeleves",
    aliases: ['le','list'],
    description: lang.get('cmd_liste_desc'),
    args: false,
    usage: "",
    execute(message, args) {
        //Pass the arguments to the PresenceSupervisor and return errors if needed
     try {
            

        db.Utilisateur.findAll({ where: { RoleId: '1' } }).then(Utilisateur => {
            let ListeEtudiantChaine = "";
            for (let i = 0; i < Utilisateur.length; i++) {
                ListeEtudiantChaine += "🎓" + Utilisateur[i].nom + " " + Utilisateur[i].prenom + " <@" + Utilisateur[i].id_discord + "> \n";
            }
            if(ListeEtudiantChaine === "") ListeEtudiantChaine = lang.get('cmd_list_aucun')

            embed_liste_etudiant.embed.fields[0].value = ListeEtudiantChaine;
            message.channel.send({ embed: embed_liste_etudiant.embed });
    
        }).catch(() => {
            console.log("erreur dans  listEleves.js");
        })



        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}