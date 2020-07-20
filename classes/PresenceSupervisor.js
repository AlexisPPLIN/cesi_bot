const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')
const moment = require('moment');
moment.locale('fr')

const db = require('../models/index');
const env = require('../config.json');

const Queue = require('bull');
let embedQueue = new Queue('embed', 'redis://127.0.0.1:6379');

module.exports = class PresenceSupervisor{
    constructor(start_arg,end_arg) {
        let start_date = this.parseDate(start_arg);
        let end_date = this.parseDate(end_arg);
        if(this.validateStartEndDate(start_date,end_date)){
            this.start = start_date;
            this.end = end_date;
        }
    }

    validateArgumentFormat(arg){
        let regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
        if(!regex.test(arg)) throw new ArgumentValidationError(arg);
        return true;
    }

    parseDate(string_time){
        if(this.validateArgumentFormat(string_time)){
            let date = new Date();
            let date_splited = string_time.split(':');
            date.setHours(date_splited[0],date_splited[1],0,0)

            return date;
        }
    }

    validateStartEndDate(start_date,end_date){
        if(start_date >= end_date) {
            throw new EndBeforeStartError();
        }

        let time_now = new Date();
        if(start_date < time_now || end_date < time_now){
            throw new TimeAlreadyPassedError();
        }
        return true;
    }

    registerPeriodToDatabase(callback){
        db.Periode.findOrCreate({where : {debut: this.start, fin: this.end},defaults: {pre_debut: new Date()}})
            .then(([periode,created]) =>{
                this.periode = periode;
                callback(periode,created);
            })
    }

    planStartEmbedSend(channel_id){
        let cron = moment(this.start).format("s m k D M d")

        embedQueue.add({
            channel_id : channel_id,
            embed: this.generateStartPeriodEmbed()
        },{
            repeat:{
                cron: cron,
                tz: "Europe/Paris",
                limit: 1
            }
        });
    }

    /* Embeds */

    generatePreStartPeriodEmbed(){
        let date_now = new Date();
        let start_moment = moment(this.start);
        let description = moment().format('L');
        let text = moment().format('LT')+' - '+start_moment.format('LT')+' (retard enregisté)';

        return {
            "title": "Déclaration des présences",
            "description": description,
            "url": "https://discordapp.com",
            "color": 10071592,
            "timestamp": date_now.toString(),
            "author": {
                "name": "CESI Bot",
                "url": "https://github.com/DevEkode/cesi_bot",
                "icon_url": "https://puu.sh/G2gn6/c26897ba03.png"
            },
            "fields": [
                {
                    "name": "Période de déclaration",
                    "value": text
                },
                {
                    "name": "Utilisez !present ci-dessous",
                    "value": "Vous receverez un message privé qui vous confirmera votre présence."
                }
            ]
        };
    }

    generateStartPeriodEmbed(){
        return {
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
    }
}