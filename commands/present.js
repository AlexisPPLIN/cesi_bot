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
    name: "present",
    aliases: ['présent', 'présente', 'presente'],
    description: lang.get('cmd_present_desc'),
    args: false,
    usage: "",
    execute(message, args) {
        //Pass the arguments to the PresenceSupervisor and return errors if needed
        let supervisor;
        try {

            //modification dans la bd avec l'heure et en fct de l'id
            var dateActuel = new Date();



            //compte nombre ligne
            db.Periode.count({
                where: {
                    pre_debut: {
                        [db.Sequelize.Op.lte]: dateActuel
                    }, fin: {
                        [db.Sequelize.Op.gte]: dateActuel
                    }
                },
                attributes: ['id']
            }).then(compteurPeriode => {
              
                //si il y a un resultat alors
                if (compteurPeriode != 0) {

                    // cherche l'id de la periode
                    db.Periode.findOne({
                        where: {
                            pre_debut: {
                                [db.Sequelize.Op.lte]: dateActuel
                            }, fin: {
                                [db.Sequelize.Op.gte]: dateActuel
                            }
                        },
                        attributes: ['id', 'debut', 'fin', 'pre_debut']
                    }).then(Periode => {
                        console.log(dateActuel)
                        console.log(Periode.debut)
                        console.log("periode trouver: id n°" + Periode.id);


                        db.Utilisateur.count({ //afin de determiner si il fait parti de la liste des etudiant
                            where: { id_discord: message.author.id },
                            attributes: ['id']
                        }).then(countUtilisateur => {
                            if (countUtilisateur != 0) {
                                //cherche l'id de l'user
                                db.Utilisateur.findOne({
                                    where: { id_discord: message.author.id },
                                    attributes: ['id', 'prenom', 'nom', 'RoleId']
                                }).then(Utilisateur => {

                                    console.log(dateActuel.getHours());

                                    var heurechaine = Periode.debut.getHours() + ":" + Periode.debut.getMinutes() + "-" + Periode.fin.getHours() + ":" + Periode.fin.getMinutes();
                                    if (dateActuel > Periode.debut) {
                                        var statutid = STATUT.RETARD;
                                    }
                                    else {
                                        var statutid = STATUT.PRESENT;
                                    }

                                    db.Presence
                                        .findOrCreate({ where: { UtilisateurId: Utilisateur.id, StatutId: statutid, PeriodeId: Periode.id }, defaults: { UtilisateurId: Utilisateur.id, StatutId: statutid, PeriodeId: Periode.id, date_arrive: dateActuel } })
                                        .then(([Presence, created]) => {

                                            if (created) {
                                                embed_confirmation_presence_mp.embed.fields[0].value = Utilisateur.nom + " " + Utilisateur.prenom //modifie le nom /* mettre le nom de la base de donne en fct de l'id
                                                embed_confirmation_presence_mp.embed.description = heurechaine
                                                embed_confirmation_presence_mp.embed.timestamp = dateActuel;

                                                //envoi mp confirmation

                                                message.author.send({ embed: embed_confirmation_presence_mp.embed });
                                            }
                                            else {
                                                message.author.send(lang.get('cmd_present_error_already'));


                                            }
                                        })

                                })
                            }
                            else { message.author.send(lang.get('cmd_present_error_not_student')); }
                        }).catch(() => {
                            console.log("erreur inconu");
                        });


                        //supresion message
                    }).catch(() => {
                        console.log("erreur inconu");
                    })

                }
                else {
                    message.author.send(lang.get('cmd_present_error_no_class'));
                }


            });
            message.delete();//supprime le msg

        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}