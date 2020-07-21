const PeriodesSupervisor = require('../classes/PeriodesSupervisor')

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')

module.exports = {
    name: "listperiodes",
    aliases: ['lp'],
    description: "Donne la liste des périodes d'une date donnée",
    args: true,
    usage: "<date dd/mm/yyyy>",
    execute(message, args) {
        let supervisor;
        try{
            supervisor = new PeriodesSupervisor(args[0]);
        }catch(e){
            if(e instanceof ArgumentValidationError){
                message.channel.send('Date argument not valid, check the format (DD/MM/YYYY) !')
            }
        }

        supervisor.generateViewPeriodesEmbed(embed => {
            message.channel.send({embed: embed});
        });

    }
}