const db = require('../models/index');

module.exports = {
    name: "askpresences",
    aliases: ['ap'],
    description: "Démarre une période de déclaration de présence dans ce channel textuel",
    args: true,
    usage: "<heure:minutes début> <heure:minutes fin>",
    execute(message,args){
        // Validate arguments
        let regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
        if(!regex.test(args[0]) || !regex.test(args[1])){
            message.channel.send('One of the arguments was not in a correct time format (HH:MM)');
            return;
        }

        // Set start and end date
        let start_date = new Date();
        let start_splited = args[0].split(':');
        start_date.setHours(start_splited[0],start_splited[1],0,0)

        let end_date = new Date();
        let end_splited = args[1].split(':');
        end_date.setHours(end_splited[0],end_splited[1],0,0)

        // Check if the start date is not after or equal to the end time
        if(start_date >= end_date){
            message.channel.send('The start time cannot start after or be equal to the end time !');
            return;
        }

        //Check if the time has not already passed
        let time_now = new Date();
        if(start_date < time_now || end_date < time_now){
            message.channel.send('This time period already passed');
            return;
        }

        // Check if another période with the same arguments already exists
        db.Periode.findOne({
            where: {debut: start_date, fin: end_date},
            attributes: ['id']
        }).then(periode =>{
            if(periode === null){
                //Does not exists, create a new one
                db.Periode.create({
                    debut: start_date,
                    fin: end_date
                }).then(periode =>{
                    // Periode registered, now send message

                })
            }else{
                //Already exists
                message.channel.send('This time period already exists !');
            }
        })
    },
}