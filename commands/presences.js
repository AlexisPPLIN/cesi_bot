const PresenceSupervisor = require('../classes/PresenceSupervisor');

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
    description: "envoi un mp à l’intervenant avec tous les absent, les present et les retard",
    args: true,
    usage: "!présences [date] [matin/aprem]",
    execute(message, args) {

        try {




            var dateActuel = new Date();

            //date debut periode
            var datePeriodeDebut = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 0, 0, 1);

            //date fin periode
            var datePeriodeFin = new Date(dateActuel.getFullYear(), dateActuel.getMonth(), dateActuel.getDate(), 23, 59, 59);

            db.Utilisateur.findAll({
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
                        attributes: ['debut', 'fin'],
                        where: {
                            pre_debut: {
                                [db.Sequelize.Op.lte]: dateActuel
                            }, fin: {
                                [db.Sequelize.Op.gte]: dateActuel
                            }
                        },
                        required: true,
                        right: true,

                    }, {
                        model: db.Utilisateur,
                        attributes: ['id','prenom', 'nom', 'id_discord'],
                        where: { RoleId: 1 },
                        required: true,
                        right: true

                    }]

                }).then(Presence => {

                    var ListeEtudiantChaine = "";
                    var dateActuel = new Date();

                    var ListePresencePeriode1 = "";
                    var ListePresencePeriode2 = "";

                    for (var i = 0; i < listeIDEtudiant.length; i++) {
                        for (var j = 0; j < Presence.length; j++) {

                            console.log(listeIDEtudiant[i])
                            console.log(Presence[j].Utilisateur.id)


                            if (listeIDEtudiant[i] == Presence[j].Utilisateur.id) {
                                console.log(listeIDEtudiant[i])
                                ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + Presence[j].Utilisateur.nom + " " + Presence[j].Utilisateur.prenom + "\n";


                                var datedebut = new Date(Presence[j].Periode.debut);


                                console.log(Presence[j].Statut.nom);

                      
                               

                                    if (Presence[j].Statut.id == STATUT.RETARD) {


                                        var tempsMinute = Presence[j].Periode.debut - Presence[j].date_arrive  ;
 
    
                                       // tempsMinute = (Math.floor((tempsMinute-((Math.floor(tempsMinute/1000))% 60))/60)) % 60;    
                                        
                                        var diff =( Presence[j].Periode.debut.getTime() - Presence[j].date_arrive.getTime()) / 1000;
                                        diff /= 60;
                                        tempsMinute=  Math.abs(Math.round(diff))
                                        diff /= 60;
                                        tempsheure=  Math.abs(Math.round(diff))




                                        ListePresencePeriode1 = ListePresencePeriode1 + "✅ (⏰"+tempsheure+":"+tempsMinute+")";



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


                                    var heurechaine = Presence[j].Periode.debut.getHours() +":"+ Presence[j].Periode.debut.getMinutes() +"-"+ Presence[j].Periode.fin.getHours() +":"+ Presence[j].Periode.fin.getMinutes();
                            }
                        }
                    }
                    console.log(ListePresencePeriode1);
                    //console.log("test:" + ListePresencePeriode2);
                    embed_presence_jour.embed.fields[1].value = ListePresencePeriode1;
                    embed_presence_jour.embed.fields[1].name= heurechaine
                    embed_presence_jour.embed.fields[0].value = ListeEtudiantChaine;
                    message.channel.send({ embed: embed_presence_jour.embed });
                })







            })

        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}