const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');
const db = require('../models/index');
const env = require('../config.json');

const PeriodeDeleter = require('../classes/PeriodeDeleter');

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const PeriodDoesntExistsError = require('../Exceptions/PeriodDoesntExistsError')

const Queue = require('bull');
let embedQueue = new Queue('embed', 'redis://'+env.redis_host+':'+env.redis_port);

module.exports = {
    name: "deleteperiode",
    aliases: ['dp'],
    description: lang.get('cmd_deleteperiode_desc'),
    args: true,
    usage: lang.get('cmd_deleteperiode_usage'),
    execute(message, args) {

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