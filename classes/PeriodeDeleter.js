const Queue = require('bull');
const db = require('../models/index');
const env = require('../config.json');
let embedQueue = new Queue('embed', 'redis://' + env.redis_host + ':' + env.redis_port);

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const PeriodDoesntExistsError = require('../Exceptions/PeriodDoesntExistsError')


module.exports = class PeriodeDeleter {
    constructor(id) {
        this.period_id = this.parseArgument(id);
    }

    parseArgument(id) {
        let periode_id = Number(id)
        if (isNaN(periode_id)) {
            throw new ArgumentValidationError()
        }
        return periode_id;
    }

    deletePeriode() {
        let start_job_id = this.period_id + 's';
        let end_job_id = this.period_id + 'e';

        db.Periode.findByPk(this.period_id).then(periode => {
            if(periode !== null){
                //Delete jobs
                this.deleteJob(start_job_id).then(() => {
                    this.deleteJob(end_job_id).then(() => {
                        return db.Periode.destroy({where: {id: this.period_id}})
                    })
                })
            }
        });
    }

    async deleteJob(job_id) {
        const repeatableJobs = await embedQueue.getRepeatableJobs();
        const jobWithId = repeatableJobs.filter(job => job.key.includes(job_id))[0];
        if (jobWithId) embedQueue.removeRepeatableByKey(jobWithId.key);
    }
}