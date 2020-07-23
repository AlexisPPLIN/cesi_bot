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

    deleteJobs(callback) {
        let start_job_id = this.period_id + 's';
        let end_job_id = this.period_id + 'e';

        this.deleteJob(start_job_id,() => {
            this.deleteJob(end_job_id,() => {
                callback();
            });
        });

    }

    deletePeriode(callback) {
        this.deleteJobs(() => {
            db.Periode.findByPk(this.period_id).then(periode => {
                if (periode !== null) {
                    //Delete jobs
                    db.Periode.destroy({where: {id: this.period_id}})
                        .then(() => {
                            callback();
                        })
                }
            });
        })

    }

    deleteJob(job_id,callback) {
        embedQueue.getDelayed()
            .then(repeatableJobs => {
                const jobWithId = repeatableJobs.filter(job => job.data.jobId === job_id)[0];
                if (jobWithId) {
                    jobWithId.remove().then(() => {callback()})
                }else{
                    callback();
                }
            })

    }
}