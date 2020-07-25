const embed_presence_jour = {
    embed: {
      title: "Résumé des présences",
      description: "13/06/2020",
      url: "https://github.com/DevEkode/cesi_bot",
      color: 10071592,
      author: {
        name: "CESI Bot",
        url: "https://github.com/DevEkode/cesi_bot",
        icon_url: "https://puu.sh/G2gn6/c26897ba03.png"
      },
      fields: [
        {
          name: "Etudiant",
          value: "🎓Alexis POUPELIN\n🎓Justin BAHIER\n🎓Test",
          inline: true
        },
        {
          name: "Matin",
          value: "✅ (⏰12min)\n✅\n✅",
          inline: true
        },
       /* {
          name: "Après-midi",
          value: "✅\n❌\n❔",
          inline: true
        },*/
        {
          name: "Légende",
          value: "✅ Présent\n❔ En attente\n❌ Absent\n⏰ Retard (temps)"
        }
      ]
    }
  };
  module.exports = embed_presence_jour;