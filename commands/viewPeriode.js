const appRoot = require('app-root-path');
const lang = require(appRoot + '/lang/Language');

let moment = require('moment'); // require
moment().format();

const PresenceSupervisor = require('../classes/PresenceSupervisor');

const PeriodDoesntExistsError = require('../Exceptions/PeriodDoesntExistsError')
const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')
const AucunEleveError = require('../Exceptions/AucunEleveError')

embed_presence_jour = require(__dirname + '/../embed\\embed_presence_jour.js');

const db = require('..\\models\\index');

module.exports = {
    name: "viewperiode",
    aliases: ['vp'],
    description: lang.get('cmd_presences_desc'),
    args: true,
    usage: lang.get('cmd_presences_usage'),
    execute(message, args) {

        try {
            if (args.length > 1) throw new ArgumentValidationError(args);

            db.Periode.findOne({where: {id: args[0]}})
                .then(periode => {
                    periode.getPresences()
                        .then(presences => {
                            let listeUtilisateurs = "";
                            let listeStatut = "";
                            presences.forEach(presence => {
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

                                                    listeStatut += "✅ (⏰" + ms + ")";
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

                                        let presence_debut = moment(periode.get('debut')).format('HH:mm')
                                        let presence_fin = moment(periode.get('fin')).format('HH:mm')
                                        let heurechaine = presence_debut + " - " + presence_fin;

                                        embed_presence_jour.embed.fields[1].value = listeStatut;
                                        embed_presence_jour.embed.fields[1].name = heurechaine
                                        embed_presence_jour.embed.fields[0].value = listeUtilisateurs;
                                        embed_presence_jour.embed.description = moment().format('L');
                                        message.channel.send({embed: embed_presence_jour.embed});
                                    })
                            })
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