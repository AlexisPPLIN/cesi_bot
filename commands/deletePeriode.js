const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');
const db = require(appRoot+'/models/index');

const PeriodeDeleter = require(appRoot+'/classes/PeriodeDeleter');
const PermissionsManager = require(appRoot+'/classes/PermissionsManager');

const ArgumentValidationError = require(appRoot+'/Exceptions/ArgumentValidationError')
const PeriodDoesntExistsError = require(appRoot+'/Exceptions/PeriodDoesntExistsError')

module.exports = {
    name: "deleteperiode",
    aliases: ['dp'],
    description: lang.get('cmd_deleteperiode_desc'),
    args: true,
    usage: lang.get('cmd_deleteperiode_usage'),
    execute(message, args) {
        // Check permissions
        if(!new PermissionsManager().hasPermission(message)) {
            message.channel.send(lang.get('exception_not_allowed'));
            return;
        }

        //Validate arguments
        try{
            let supervisor = new PeriodeDeleter(args[0]);

            db.Periode.findByPk(supervisor.period_id)
                .then(period => {
                    if(period === null) throw new PeriodDoesntExistsError();

                    supervisor.deletePeriode(() => {
                        message.channel.send(lang.get('cmd_deleteperiode_success'))
                    })
                })
                .catch(() => {
                    message.channel.send(lang.get('cmd_deleteperiode_exists'));
                })

        }catch (e) {
            if(e instanceof ArgumentValidationError){
                message.channel.send(lang.get('exception_argument_format'))
            }else if(e instanceof PeriodDoesntExistsError){
                message.channel.send(lang.get('cmd_deleteperiode_exists'))
            }
        }
    },
}