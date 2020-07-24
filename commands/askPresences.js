const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');

const PresenceSupervisor = require('../classes/PresenceSupervisor');

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')

module.exports = {
    name: "askpresences",
    aliases: ['ap'],
    description: lang.get('cmd_askpresences_title'),
    args: true,
    usage: lang.get('cmd_askpresences_usage'),
    execute(message, args) {
        //Pass the arguments to the PresenceSupervisor and return errors if needed
        let supervisor;
        try {
            supervisor = new PresenceSupervisor(args[0], args[1]);

            // Use the PresenceSupervisor to register the periode to database
            supervisor.registerPeriodToDatabase((periode, created, overlap) => {
                if (overlap) {
                    message.channel.send(lang.get('cmd_askpresences_error_overlap'));
                } else if (!created) {
                    message.channel.send(lang.get('cmd_askpresences_error_exists'));
                }else{
                    // Send the embed
                    let start_embed = supervisor.generatePreStartPeriodEmbed();
                    message.channel.send({embed: start_embed});

                    // Plan end period embed
                    supervisor.planEmbedSend(message.channel.id,periode.get('id'));
                }
            })
        } catch (e) {
            if (e instanceof ArgumentValidationError) {
                message.channel.send(lang.get('exception_argument_format')+' (HH:MM)');
            } else if (e instanceof EndBeforeStartError) {
                message.channel.send(lang.get('exception_end_before_start'));
            } else if (e instanceof TimeAlreadyPassedError) {
                message.channel.send(lang.get('exception_time_passed'));
            }
        }
    },
}