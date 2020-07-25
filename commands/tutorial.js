const appRoot = require('app-root-path');
const lang = require(appRoot + '/lang/Language');

module.exports = {
    name: "tutorial",
    aliases: ['tuto'],
    description: lang.get('cmd_tutorial_desc'),
    args: false,
    usage: "",
    execute(message, args) {
        const embed = {
            "title": "Tutoriel pour utiliser le bot",
            "description": "Pour mieux comprendre le fonctionnement du bot",
            "url": "https://github.com/DevEkode/cesi_bot",
            "color": 10071592,
            "author": {
                "name": "CESI Bot",
                "url": "https://github.com/DevEkode/cesi_bot",
                icon_url: "https://puu.sh/G2gn6/c26897ba03.png"
            },
            "fields": [
                {
                    "name": "Etape n°1 : Ajouter les élèves",
                    "value": "Pour chaque élève à enregistrer, un admin utilise la commande `!addstudent`\n(ex : `!addstudent POUPELIN Alexis @Ekode`)"
                },
                {
                    "name": "Etape n°2 : Créer une période de cours",
                    "value": "L'intervenant crée la période avec `!askpresences 8:45 12:15` à 8:00\nLes étudiants déclarent leur présence avec `!present` en dessous"
                },
                {
                    "name": "Etape n°3 : Gestion des absences",
                    "value": "`!present` entre 8:00 et 8:45 = :white_check_mark: présent\n`!present` entre 8:45 et 12:15 = :white_check_mark: présent (avec du retard affiché :alarm_clock: )\n Aucune déclaration avant 12:15 = :x: Absent"
                },
                {
                    "name": "Etape n°4 : Récapitulatif de la période",
                    "value": "Pendant la période, utilisez `!viewperiode` pour un résumé des présences\nVous pouvez aussi voir les période des jours précédents avec `!listperiodes`"
                }
            ]
        };
        message.channel.send({ embed });
    }
}