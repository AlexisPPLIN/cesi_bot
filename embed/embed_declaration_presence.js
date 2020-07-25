const embed_declaration_presence =  {
    embed: {
      title: "Déclaration des présences",
      description: "13/06/2020 - Matin",
      url: "https://github.com/DevEkode/cesi_bot",
      color: 10071592,
      timestamp: "2020-06-13T10:05:38.205Z",
      author: {
        name: "CESI Bot",
        url: "https://github.com/DevEkode/cesi_bot",
        icon_url: "https://puu.sh/G2gn6/c26897ba03.png"
      },
      fields: [
        {
          name: "Période de déclaration",
          value: "8h00 - 8h45 (retard enregisté)"
        },
        {
          name: "Utilisez !present ci-dessous",
          value: "Vous receverez un message privé qui vous confirmera votre présence."
        }
      ]
    }
  }

  module.exports = embed_declaration_presence;