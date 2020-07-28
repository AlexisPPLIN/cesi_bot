const appRoot = require('app-root-path');
const lang = require(appRoot + '/lang/Language');
const db = require(appRoot+'/models/index');
let moment = require('moment'); // require
moment().format();

const PeriodDoesntExistsError = require(appRoot+'/Exceptions/PeriodDoesntExistsError')
const ArgumentValidationError = require(appRoot+'/Exceptions/ArgumentValidationError')
const AucunEleveError = require(appRoot+'/Exceptions/AucunEleveError')

embed_presence_jour = require(appRoot+'/embed/embed_presence_jour.js');

module.exports = {
    name: "viewperiode",
    aliases: ['vp'],
    description: lang.get('cmd_presences_desc'),
    args: false,
    usage: lang.get('cmd_presences_usage'),
    allowed_in_dm: true,
    execute(message, args) {
        try {
            if (args.length > 1) throw new ArgumentValidationError(args);

            let where_args;
            if (args.length === 0) {
                where_args = {
                    pre_debut: {
                        [db.Sequelize.Op.lte]: new Date()
                    }, fin: {
                        [db.Sequelize.Op.gte]: new Date()
                    }
                }
            } else {
                where_args = {
                    id: args[0]
                }
            }

            let listeUtilisateurs = "";
            let listeStatut = "";
            db.Periode.findOne({where: where_args})
                .then(periode => {
                    if(periode === null){
                        message.channel.send(lang.get('cmd_present_error_no_class'))
                        return;
                    }
                    periode.getPresences()
                        .then(presences => {
                            presences.forEach((presence,index) => {
                                presence.getUtilisateur()
                                    .then(user => {
                                        listeUtilisateurs += "🎓" + user.get('nom') + " " + user.get('prenom') + "\n"
                                        switch (presence.get('StatutId')) {
                                            case 1:
                                                if (presence.get('date_arrive') > periode.get('debut')) {
                                                    // En retard
                                                    let now = moment(presence.get('date_arrive'));
                                                    let then = moment(periode.get('debut'));

                                                    let ms = moment.utc(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")

                                                    listeStatut += "✅ (⏰" + ms + ")\n";
                                                } else {
                                                    // Présent, a l'heure
                                                    listeStatut += "✅\n"
                                                }
                                                break;
                                            case 2:
                                                listeStatut += "❌\n"
                                                break;
                                            case 3:
                                                listeStatut += "❔\n"
                                                break;
                                        }

                                        if(index >= presences.length-1){
                                            let presence_debut = moment(periode.get('debut')).format('HH:mm')
                                            let presence_fin = moment(periode.get('fin')).format('HH:mm')
                                            let heurechaine = presence_debut + " - " + presence_fin;

                                            embed_presence_jour.embed.fields[1].value = listeStatut;
                                            embed_presence_jour.embed.fields[1].name = heurechaine
                                            embed_presence_jour.embed.fields[0].value = listeUtilisateurs;
                                            embed_presence_jour.embed.description = moment().format('L');
                                            message.channel.send({embed: embed_presence_jour.embed});
                                        }
                                    })
                            });
                        })
                        .catch(() => {
                            throw new AucunEleveError();
                        })

                })
                .catch(() => {
                    throw new PeriodDoesntExistsError();
                })
        } catch (e) {
            if (e instanceof ArgumentValidationError) {
                message.channel.send(lang.get('exception_argument_format'))
            } else if (e instanceof PeriodDoesntExistsError) {
                message.channel.send(lang.get('cmd_deleteperiode_exists'))
            } else if (e instanceof AucunEleveError) {
                message.channel.send(lang.get('cmd_AucunEleveError'))
            }
        }
    },
}