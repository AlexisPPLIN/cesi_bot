const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');
const PresenceSupervisor = require('../classes/PresenceSupervisor');

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')
embed_confirmation_presence_mp = require(__dirname + '/../embed/embed_confirmation_presence_MP.js');


const db = require(appRoot+'/models/index');
const STATUT = {
    RETARD: 1,
    PRESENT: 2,
    EN_ATTENTE: 3,
    ABSENT: 4
};


module.exports = {
    name: "deletestudent",
    aliases: ['ds'],
    description: lang.get('cmd_delete_desc'),
    args: true,
    usage: lang.get('cmd_delete_usage'),
    execute(message, args) {
        try {
   
                var IdDiscordUtilisateur = args[0];

if(args.length !=1 )  throw new ArgumentValidationError(args);


          //  var PrenomUtilisateur = args[0];

         

          if (IdDiscordUtilisateur.startsWith('<@') && IdDiscordUtilisateur.endsWith('>')) {
              IdDiscordUtilisateur = IdDiscordUtilisateur.slice(2, -1);

              if (IdDiscordUtilisateur.startsWith('!')) {
                  IdDiscordUtilisateur = IdDiscordUtilisateur.slice(1);
              }

          }

            
          if(IdDiscordUtilisateur!=0 && !IdDiscordUtilisateur.startsWith('&') && IdDiscordUtilisateur!='@here' &&IdDiscordUtilisateur!='@everyone'){
           
            db.Utilisateur.findOne({where: {id_discord: IdDiscordUtilisateur}}).then(Utilisateur => {
                
                if (Utilisateur==null) {
                    message.channel.send(lang.get('cmd_delete_error_exists'));
                }
                else {
                    message.channel.send(lang.get('cmd_delete_success'));
                    return Utilisateur.destroy();
                   
                }




             
            });

        }  else
        {message.channel.send(lang.get('cmd_link_error_autre_mention'));}

        } catch (e) {
            if(e instanceof ArgumentValidationError){
                message.channel.send(lang.get('exception_argument_format'))
            }
            console.log("erreur:" + e);
        }
    },
}