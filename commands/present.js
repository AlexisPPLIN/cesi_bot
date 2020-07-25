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
                    }).then(Periodeactuel => {
                        console.log(dateActuel)
                        console.log(Periodeactuel.debut)
                        console.log("periode trouver: id n°" + Periodeactuel.id);


                        db.Utilisateur.count({ //afin de determiner si il fait parti de la liste des etudiant
                            where: { id_discord: message.author.id },
                            attributes: ['id']
                        }).then(countUtilisateur => {
                            if (countUtilisateur != 0) {
                                //cherche l'id de l'user
                                db.Utilisateur.findOne({
                                    where: { id_discord: message.author.id },
                                    attributes: ['id', 'prenom', 'nom', 'RoleId']
                                }).then(Utilisateuractuel => {

                                    console.log(dateActuel.getHours());

                                    var heurechaine = Periodeactuel.debut.getHours() + ":" + Periodeactuel.debut.getMinutes() + "-" + Periodeactuel.fin.getHours() + ":" + Periodeactuel.fin.getMinutes();
                                    if (dateActuel > Periodeactuel.debut) {
                                        var statutid = STATUT.RETARD;
                                    }
                                    else {
                                        var statutid = STATUT.PRESENT;
                                    }


               
                                    db.Presence
                                        .findOrCreate({ where: { UtilisateurId: Utilisateuractuel.id, StatutId: statutid, PeriodeId: Periodeactuel.id }, defaults: { UtilisateurId: Utilisateuractuel.id, StatutId: statutid, PeriodeId: Periodeactuel.id, date_arrive: dateActuel } })
                                        .then(([Presence, created]) => {

                                            if (created) {
                                                embed_confirmation_presence_mp.embed.fields[0].value = Utilisateuractuel.nom + " " + Utilisateuractuel.prenom //modifie le nom /* mettre le nom de la base de donne en fct de l'id
                                                embed_confirmation_presence_mp.embed.description = heurechaine
                                                embed_confirmation_presence_mp.embed.timestamp = dateActuel;
                                               
                                                //envoi mp confirmation

  /*suppresion des presence avec le statut en attente */
  db.Presence.findOne({
    where: {
        '$Periode.id$': Periodeactuel.id,'$Utilisateur.id$':Utilisateuractuel.id,'$Statut.id$':3
    },
    attributes: ['id','date_arrive'],
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
        attributes: ['id', 'prenom', 'nom', 'id_discord','RoleId'],
        where: {  RoleId: 1 },
        required: true,
        right: true

    }]

}).then(PresenceInner => {
    return PresenceInner.destroy();

}).catch((e) => {
      console.log("erreur test:"+e);
})
  /*fin de suppresion des presence avec le statut en attente */

                               




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