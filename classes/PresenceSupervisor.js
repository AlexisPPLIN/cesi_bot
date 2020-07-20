const db = require('../models/index');
const Op = db.Sequelize.Op;
const moment = require('moment');
const Queue = require('bull');
const env = require('../config.json');

moment.locale('fr')
let embedQueue = new Queue('embed', 'redis://'+env.redis_host+':'+env.redis_port);

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')

/**
 * Supervisor of the !askpresence command
 * @type {PresenceSupervisor}
 * @author DevEkode
 */
module.exports = class PresenceSupervisor{
    constructor(start_arg,end_arg) {
        let start_date = this.parseDate(start_arg);
        let end_date = this.parseDate(end_arg);
        if(this.validateStartEndDate(start_date,end_date)){
            this.start = start_date;
            this.end = end_date;
        }
    }

    /**
     * Validate format of an argument (HH:MM)
     * @param arg
     * @returns {boolean}
     */
    validateArgumentFormat(arg){
        let regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
        if(!regex.test(arg)) throw new ArgumentValidationError(arg);
        return true;
    }

    /**
     * Parse the string given (HH:MM) into a Date object
     * @param string_time
     * @returns {Date}
     */
    parseDate(string_time){
        if(this.validateArgumentFormat(string_time)){
            let date = new Date();
            let date_splited = string_time.split(':');
            date.setHours(date_splited[0],date_splited[1],0,0)

            return date;
        }
    }

    /**
     * Validate if the start and end dates do not overlap or inverted
     * @param start_date
     * @param end_date
     * @returns {boolean}
     */
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

    /**
     * Save the period of this object to the database (if it doesn't exists)
     * @param callback
     */
    registerPeriodToDatabase(callback){
        this.isPeriodOverlapping((isOverlapping) => {
            if(isOverlapping) callback(null,null,true)
            else{
                db.Periode.findOrCreate({where : {debut: this.start, fin: this.end},defaults: {pre_debut: new Date()}})
                    .then(([periode,created]) =>{
                        this.periode = periode;
                        callback(periode,created,false);
                    })
            }
        });
    }

    /**
     * Register the start and end embed into the queue to be displayed later
     * @param channel_id
     */
    planEmbedSend(channel_id){
        let cron_start = moment(this.start).format("s m k D M d")
        let cron_end = moment(this.end).format("s m k D M d")

        // Plan start embed
        embedQueue.add({
            channel_id : channel_id,
            embed: this.generateStartPeriodEmbed()
        },{
            repeat:{
                cron: cron_start,
                tz: "Europe/Paris",
                limit: 1
            }
        });

        //Plan end embed
        embedQueue.add({
            channel_id : channel_id,
            embed: this.generateEndPeriodEmbed()
        },{
            repeat:{
                cron: cron_end,
                tz: "Europe/Paris",
                limit: 1
            }
        });
    }

    /**
     * Check if the current period is overlapping with another period
     * @param callback
     */
    isPeriodOverlapping(callback){
        db.Periode.findOne({where : {
            fin : {[Op.gt]: new Date()},
            debut : {[Op.lt]: this.end}
        }}).then((periode) => {
            callback(periode !== null);
        })
    }

    /* Embeds */

    generatePreStartPeriodEmbed(){
        let date_now = new Date();
        let start_moment = moment(this.start);
        let text = moment().format('LT')+' - '+start_moment.format('LT')+' (retard enregisté)';

        return {
            "title": "Déclaration des présences",
            "url": "https://github.com/DevEkode/cesi_bot",
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
        let end_time = moment(this.end).format('LT');
        return {
            "title": "Fin déclaration des présences",
            "url": "https://github.com/DevEkode/cesi_bot",
            "color": 10071592,
            "timestamp": this.start.toString(),
            "author": {
                "name": "CESI Bot",
                "url": "https://github.com/DevEkode/cesi_bot",
                "icon_url": "https://puu.sh/G2gn6/c26897ba03.png"
            },
            "fields": [
                {
                    "name": "Les présences déclarées après ce message sont considéré avec du retard",
                    "value": "Après "+end_time+" vous serez considéré comme absent"
                }
            ]
        };
    }

    generateEndPeriodEmbed(){
        let text = moment(this.start).format('LT')+' - '+moment(this.end).format('LT');
        return {
            "title": "Fin de la période",
            "url": "https://github.com/DevEkode/cesi_bot",
            "color": 10071592,
            "timestamp": this.end.toString(),
            "author": {
                "name": "CESI Bot",
                "url": "https://github.com/DevEkode/cesi_bot",
                "icon_url": "https://puu.sh/G2gn6/c26897ba03.png"
            },
            "fields": [
                {
                    "name": text,
                    "value": "Les personnes n'ayant pas répondu sont déclarés comme absentes"
                }
            ]
        };
    }
}