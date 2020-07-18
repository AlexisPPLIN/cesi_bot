const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')

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

    GenerateStartPeriodEmbed(start_date){
        let date_now = new Date();
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
        return embed;
    }
}