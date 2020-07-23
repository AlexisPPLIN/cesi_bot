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
    description: "Supprime une période donnée",
    args: true,
    usage: "<periode ID>",
    execute(message, args) {
        //Validate arguments
        try{
            let supervisor = new PeriodeDeleter(args[0]);

            db.Periode.findByPk(supervisor.period_id)
                .then(period => {
                    if(period === null) throw new PeriodDoesntExistsError();

                    supervisor.deletePeriode()
                        .then(() => {
                            message.channel.send('Period deleted successfully')
                        })
                })
                .catch(() => {
                    message.channel.send("This period doesn't exists ! ");
                })

        }catch (e) {
            if(e instanceof ArgumentValidationError){
                message.channel.send('One of the argument was not formatted correctly !')
            }else if(e instanceof PeriodDoesntExistsError){
                message.channel.send("This period doesn't exists ! ")
            }
        }
    },

    async deleteJob(queue,id){
        const repeatableJobs = await queue.getRepeatableJobs();
        const jobWithId = repeatableJobs.filter(job => job.key.includes(id))[0];
        if (jobWithId) queue.removeRepeatableByKey(jobWithId.key);
    }
}