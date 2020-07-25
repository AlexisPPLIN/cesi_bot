const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');

const PeriodesSupervisor = require('../classes/PeriodesSupervisor')

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')

module.exports = {
    name: "listperiodes",
    aliases: ['lp'],
    description: lang.get('cmd_listperiodes_desc'),
    args: true,
    usage: lang.get('cmd_listperiodes_usage'),
    execute(message, args) {
        let supervisor;
        try{
            supervisor = new PeriodesSupervisor(args[0]);
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