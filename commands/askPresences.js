const db = require('../models/index');
const PresenceSupervisor = require('../classes/PresenceSupervisor');

const ArgumentValidationError = require('../Exceptions/ArgumentValidationError')
const EndBeforeStartError = require('../Exceptions/EndBeforeStartError')
const TimeAlreadyPassedError = require('../Exceptions/TimeAlreadyPassedError')

module.exports = {
    name: "askpresences",
    aliases: ['ap'],
    description: "Démarre une période de déclaration de présence dans ce channel textuel",
    args: true,
    usage: "<heure:minutes début> <heure:minutes fin>",
    execute(message,args){
        //Pass the arguments to the PresenceSupervisor and return errors if needed
        let supervisor;
        try{
            supervisor = new PresenceSupervisor(args[0],args[1]);
        }catch(e){
            if(e instanceof ArgumentValidationError){
                message.channel.send('One of the argument was not formatted correctly (HH:MM)');
            }else if(e instanceof EndBeforeStartError){
                message.channel.send('The end time is before the start time !');
            }else if(e instanceof TimeAlreadyPassedError){
                message.channel.send('This time period already passed !');
            }
            return;
        }

        // Use the PresenceSupervisor to register the periode to database
        supervisor.registerPeriodToDatabase((periode,created) => {
            if(!created){
                message.channel.send("This time period already exists !");
            }else{
                // Send the embed
                let start_embed = supervisor.generateStartPeriodEmbed();
                message.channel.send({embed: start_embed});
            }
        })
    },
}