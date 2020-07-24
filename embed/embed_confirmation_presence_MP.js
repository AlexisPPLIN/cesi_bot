const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');

const embed_confirmation_presence_mp = {
    embed: {
      
      author: {
       name: "CESI Bot",
        url: "https://discordapp.com",
        icon_url: "https://i.insider.com/5e5d2aa1fee23d10847a28f8?width=750&format=jpeg&auto=webp"
      },
      title: lang.get('cmd_present_embed_title'),
      url: "https://discordapp.com",
     description: "13/06/2020 - Matin",
     
      color: 10071592,
      timestamp: "2020-06-13T10:05:38.205Z",
      fields: [
        {
          name: lang.get('student'),
          value: "Alexis POUPELIN"
        }
      ]
    }
  };
module.exports = embed_confirmation_presence_mp;