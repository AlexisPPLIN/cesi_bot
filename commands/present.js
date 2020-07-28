const appRoot = require('app-root-path');
const lang = require(appRoot + '/lang/Language');
const db = require(appRoot+'/models/index');
const env = require(appRoot+'/config.json');

embed_confirmation_presence_mp = require(appRoot+'/embed/embed_confirmation_presence_MP.js');

module.exports = {
    name: "present",
    aliases: ['présent', 'présente', 'presente'],
    description: lang.get('cmd_present_desc'),
    args: false,
    usage: "",
    allowed_in_dm: false,
    execute(message, args) {
        //Pass the arguments to the PresenceSupervisor and return errors if needed
        try {
            //modification dans la bd avec l'heure et en fct de l'id
            let dateActuel = new Date();

            db.Periode.findOne({
                where: {
                    pre_debut: {
                        [db.Sequelize.Op.lte]: dateActuel
                    }, fin: {
                        [db.Sequelize.Op.gte]: dateActuel
                    }
                }
            }).then(Periodeactuel => {
                db.Utilisateur.findOne({where: {id_discord: message.author.id}})
                    .then((utilisateur) => {
                        db.Presence.findOne({where : {
                                PeriodeId: Periodeactuel.get('id'),
                                UtilisateurId: utilisateur.get('id'),
                                StatutId : 3
                            }})
                            .then(presence => {
                                if(presence === null){
                                    message.author.send(lang.get('cmd_present_error_already'));
                                    return;
                                }

                                // Register présence to database
                                db.Presence.update({StatutId: 1, date_arrive: new Date()}, {
                                    where: {
                                        PeriodeId: Periodeactuel.get('id'),
                                        UtilisateurId: utilisateur.get('id')
                                    }
                                }).then(result => {
                                    // Send embed
                                    var heurechaine = Periodeactuel.debut.getHours() + ":" + Periodeactuel.debut.getMinutes() + "-" + Periodeactuel.fin.getHours() + ":" + Periodeactuel.fin.getMinutes();
                                    embed_confirmation_presence_mp.embed.fields[0].value = utilisateur.get('nom') + " " + utilisateur.get('prenom') //modifie le nom /* mettre le nom de la base de donne en fct de l'id
                                    embed_confirmation_presence_mp.embed.description = heurechaine
                                    embed_confirmation_presence_mp.embed.timestamp = dateActuel;

                                    message.author.send({embed: embed_confirmation_presence_mp.embed});
                                }).catch(error => {
                                    message.author.send(lang.get('cmd_present_error_already'));
                                })
                            }).catch(error => {
                                message.author.send(lang.get('cmd_present_error_already'));
                        })
                    })
            }).catch(error => {
                message.author.send(lang.get('cmd_present_error_no_class'));
            })
            if(env.auto_delete_presence_message){
                message.delete();//supprime le msg
            }

        } catch (e) {
            console.log("erreur:" + e);
        }
    },
}