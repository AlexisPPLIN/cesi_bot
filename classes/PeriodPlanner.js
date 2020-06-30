const env = require('../config.json');
const fs = require('fs');

const mongoConnectionString = 'mongodb://'+env.mongoDB_host+':'+env.mongoDB_port+'/agenda';
const Agenda = require('agenda')
const agenda = new Agenda({db: {address: mongoConnectionString}});

module.exports = class PeriodPlanner{
    constructor(channel) {
        this.model = "";
        this.channel = channel;
    }

    /**
     * Importe le fichier de model json en Objet
     * @param model_file
     * @param callback
     */
    importModel(model_file,callback){
        let model_path = './config/periodes/'+model_file;

        fs.stat(model_path,(err,stat) => {
            if(err === null){
                this.model = JSON.parse(fs.readFileSync(model_path, 'utf8'));
                callback();
            }else if(err.code === 'ENOENT'){
                throw new Error("404 : Model file not found : "+model_path);
            }
        })
    }

    /**
     * Ajoute une tâche pour chaques périodes enregistrés (pour les messages de début et de fin)
     */
    registerPeriode(start,end){
        agenda.define('send period message', {priority: 'high'}, (job, done) => {
            const {type,date} = job.attrs.data;
            if(type === "start"){
                this.sendStartPeriodEmbed(this.channel,date);
            }else if(type === "end"){
                this.sendEndPeriodEmbed(this.channel,date);
            }
        });

        (async function() {
            await agenda.start();
            await agenda.schedule(start, 'send period message', {
                type: "start",
                date: start
            });
        })();

        (async function() {
            await agenda.start();
            await agenda.schedule(end, 'send period message', {
                type: "end",
                date: end
            });
        })();
    }

    /**
     * Envoie l'embed de début de période
     */
    sendStartPeriodEmbed(channel,date){

        const embed = {
            "title": "Déclaration des présences",
            "description": "13/06/2020 - Matin",
            "url": "https://discordapp.com",
            "color": 10071592,
            "timestamp": "2020-06-13T10:05:38.205Z",
            "author": {
                "name": "CESI Bot",
                "url": "https://discordapp.com",
                "icon_url": "https://puu.sh/G2gn6/c26897ba03.png"
            },
            "fields": [
                {
                    "name": "Période de déclaration",
                    "value": "8h00 - 8h45 (retard enregisté)"
                },
                {
                    "name": "Utilisez !present ci-dessous",
                    "value": "Vous receverez un message privé qui vous confirmera votre présence."
                }
            ]
        };
        channel.send({ embed });
    }

    /**
     * Envoie l'embed de fin de période
     */
    sendEndPeriodEmbed(channel){
        const embed = {
            "title": "Fin déclaration des présences",
            "description": "13/06/2020 - Matin",
            "url": "https://discordapp.com",
            "color": 10071592,
            "timestamp": "2020-06-13T10:05:38.205Z",
            "author": {
                "name": "CESI Bot",
                "url": "https://discordapp.com",
                "icon_url": "https://puu.sh/G2gn6/c26897ba03.png"
            },
            "fields": [
                {
                    "name": "Les présences déclarées après ce message sont considéré avec du retard",
                    "value": "Après 12h15 vous serez considérer comme absent"
                }
            ]
        };
        channel.send({ embed });
    }

    /**
     * Génère un embed pour résumer le planning
     */
    generatePlanningEmbed(){

    }
}