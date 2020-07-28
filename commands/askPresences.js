const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');

const PresenceSupervisor = require(appRoot+'/classes/PresenceSupervisor');
const PermissionsManager = require(appRoot+'/classes/PermissionsManager');

const ArgumentValidationError = require(appRoot+'/Exceptions/ArgumentValidationError')
const EndBeforeStartError = require(appRoot+'/Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require(appRoot+'/Exceptions/TimeAlreadyPassedError')

module.exports = {
    name: "askpresences",
    aliases: ['ap'],
    description: lang.get('cmd_askpresences_desc'),
    args: true,
    usage: lang.get('cmd_askpresences_usage'),
    allowed_in_dm: false,
    execute(message, args) {
        // Check permissions
        if(!new PermissionsManager().hasPermission(message)) {
            message.channel.send(lang.get('exception_not_allowed'));
            return;
        }

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
                    // Regsiter the users
                    supervisor.registerStudentToPeriod(periode,() => {
                        // Send the embed
                        let start_embed = supervisor.generatePreStartPeriodEmbed();
                        message.channel.send({embed: start_embed});

                        // Plan end period embed
                        supervisor.planEmbedSend(message.channel.id,periode.get('id'));
                    })
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