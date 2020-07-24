const appRoot = require('app-root-path');
const lang = require(appRoot + '/lang/Language');

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

            var NomUtilisateur = args[0];

            var PrenomUtilisateur = args[1];

            var IdDiscordUtilisateur = args[2];

            if (IdDiscordUtilisateur.startsWith('<@') && IdDiscordUtilisateur.endsWith('>')) {
                IdDiscordUtilisateur = IdDiscordUtilisateur.slice(2, -1);

                if (IdDiscordUtilisateur.startsWith('!')) {
                    IdDiscordUtilisateur = IdDiscordUtilisateur.slice(1);
                }

            }

            if(IdDiscordUtilisateur!=0 && !IdDiscordUtilisateur.startsWith('&') && IdDiscordUtilisateur!='@here' &&IdDiscordUtilisateur!='@everyone'){

            db.Utilisateur
                .findOrCreate({ where: { id_discord: IdDiscordUtilisateur }, defaults: { nom: NomUtilisateur, prenom: PrenomUtilisateur, RoleId: '1' } })
                .then(([Utilisateur, created]) => {
                    if (created) {
                        message.channel.send(lang.get('cmd_link_success'));
                    }
                    else {

                        message.channel.send(lang.get('cmd_link_error_exists'));
                    }


                })
            }
            else
            {message.channel.send(lang.get('cmd_link_error_autre_mention'));}

        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}