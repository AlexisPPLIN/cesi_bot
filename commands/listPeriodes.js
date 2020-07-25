const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');
const moment = require('moment');
moment.locale('fr')

const PeriodesSupervisor = require('../classes/PeriodesSupervisor')

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')

module.exports = {
    name: "listperiodes",
    aliases: ['lp'],
    description: lang.get('cmd_listperiodes_desc'),
    args: false,
    usage: lang.get('cmd_listperiodes_usage'),
    execute(message, args) {
        let supervisor;
        try{
            if(args.length > 1) message.channel.send(lang.get('exception_too_many_arguments'))
            else if(args.length === 0){
                supervisor = new PeriodesSupervisor(moment().format('L'));
            }else{
                supervisor = new PeriodesSupervisor(args[0]);
            }

        }catch(e){
            if(e instanceof ArgumentValidationError){
                message.channel.send(lang.get('exception_argument_format')+' (DD/MM/YYYY) !')
            }
        }

        supervisor.generateViewPeriodesEmbed(embed => {
            message.channel.send({embed: embed});
        });

    }
}