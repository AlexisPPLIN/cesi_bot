const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');

const embed_confirmation_presence_mp = {
    embed: {
      
      author: {
       name: "CESI Bot",
        url: "https://github.com/DevEkode/cesi_bot",
        icon_url: "https://puu.sh/G2gn6/c26897ba03.png"
      },
      title: lang.get('cmd_present_embed_title'),
      url: "https://github.com/DevEkode/cesi_bot",
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