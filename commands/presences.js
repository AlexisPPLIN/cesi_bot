const appRoot = require('app-root-path');
const lang = require(appRoot + '/lang/Language');

var moment = require('moment'); // require
moment().format();

const PresenceSupervisor = require('../classes/PresenceSupervisor');

const PeriodDoesntExistsError = require('../Exceptions/PeriodDoesntExistsError')
const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')

embed_presence_jour = require(__dirname + '/../embed\\embed_presence_jour.js');


const db = require('..\\models\\index');
const STATUT = {
    RETARD: 1,
    PRESENT: 2,
    EN_ATTENTE: 3,
    ABSENT: 4
};



module.exports = {
    name: "presences",
    aliases: ['viewperiode ', 'présences'],
    description: lang.get('cmd_presences_desc'),
    args: true,
    usage: lang.get('cmd_presences_usage'),
    execute(message, args) {

        try {




            var dateActuel = new Date();

            //date debut periode
            var datePeriodeDebut = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 0, 0, 1);

            //date fin periode
            var datePeriodeFin = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 23, 59, 59);

            db.Periode.count({
                where: { id: args[0] },
                attributes: ['id']
            }).then(compteurperiodePeriode => {





                if (compteurperiodePeriode == 0) { throw new PeriodDoesntExistsError(); }

                //  if (compteurperiodePeriode != 0) {


                db.Utilisateur.findAll({// pour calculer la liste des utilisateur
                    where: { RoleId: 1 },
                    attributes: ['id', 'prenom', 'nom', 'RoleId']
                }).then(Utilisateur => {

                    var listePrenomEtudiant = [];
                    var listeIDEtudiant = [];
                    var listeNomEtudiant = [];
                    for (var i = 0; i < Utilisateur.length; i++) {
                        listePrenomEtudiant.push(Utilisateur[i].prenom)
                        listeNomEtudiant.push(Utilisateur[i].nom)
                        listeIDEtudiant.push(Utilisateur[i].id)
                    }



                    db.Presence.findAll({
                        where: {
                            '$Periode.id$': args[0]
                        },
                        attributes: ['date_arrive'],
                        include: [{
                            model: db.Statut,
                            attributes: ['id', 'nom'],
                            required: true,
                            right: true
                        }, {
                            model: db.Periode,
                            attributes: ['id', 'debut', 'fin'],
                            required: true,
                            right: true,

                        }, {
                            model: db.Utilisateur,
                            attributes: ['id', 'prenom', 'nom', 'id_discord'],
                            where: { RoleId: 1 },
                            required: true,
                            right: true

                        }]

                    }).then(Presence => {
                     
                        var ListeEtudiantChaine = "";
                        

                        var ListePresencePeriode1 = "";
                        var ListePresencePeriode2 = "";

                        for (var i = 0; i < listeIDEtudiant.length; i++) {
                            for (var j = 0; j < Presence.length; j++) {

                                if (listeIDEtudiant[i] == Presence[j].Utilisateur.id) {

                                    ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + Presence[j].Utilisateur.nom + " " + Presence[j].Utilisateur.prenom + "\n";


                                    var datedebut = new Date(Presence[j].Periode.debut);


                                    if (Presence[j].Statut.id == STATUT.RETARD) {
                                        var now = moment(Presence[j].date_arrive);
                                        var then = moment(Presence[j].Periode.debut);

                                        var ms = moment.utc(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")

                                        ListePresencePeriode1 = ListePresencePeriode1 + "✅ (⏰" + ms + ")";
                                    }
                                    else if (Presence[j].Statut.id == STATUT.PRESENT) {
                                        ListePresencePeriode1 = ListePresencePeriode1 + "✅";
                                    }
                                    else if (Presence[j].Statut.id == STATUT.EN_ATTENTE) {
                                        ListePresencePeriode1 = ListePresencePeriode1 + "❔";
                                    }
                                    else if (Presence[j].Statut.id == STATUT.ABSENT) {
                                        ListePresencePeriode1 = ListePresencePeriode1 + "❌";
                                    }

                                    ListePresencePeriode1 = ListePresencePeriode1 + "\n";


                                    var heurechaine = Presence[j].Periode.debut.getHours() + ":" + Presence[j].Periode.debut.getMinutes() + "-" + Presence[j].Periode.fin.getHours() + ":" + Presence[j].Periode.fin.getMinutes();
                                }
                            }
                        }
                        embed_presence_jour.embed.fields[1].value = ListePresencePeriode1;
                        embed_presence_jour.embed.fields[1].name = heurechaine
                        embed_presence_jour.embed.fields[0].value = ListeEtudiantChaine;
                        message.channel.send({ embed: embed_presence_jour.embed });
                    }).catch(() => {
                        console.log("erreur inconu");
                    })




                }).catch(() => {
                    console.log("erreur inconu");
                })

                // }
            }).catch(() => {
                message.channel.send(lang.get('cmd_deleteperiode_exists'));
            })

        } catch (e) {

            if (e instanceof PeriodDoesntExistsError) {
                message.channel.send(lang.get('cmd_deleteperiode_exists'))
            }
            // console.log("erreur:" + e);
        }
    },
}