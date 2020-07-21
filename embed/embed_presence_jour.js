const embed_presence_jour = {
    embed: {
      title: "Résumé des présences",
      description: "13/06/2020",
      url: "https://discordapp.com",
      color: 10071592,
      timestamp: "2020-06-13T10:05:38.205Z",
      author: {
        name: "CESI Bot",
        url: "https://discordapp.com",
        icon_url: "https://i.insider.com/5e5d2aa1fee23d10847a28f8?width=750&format=jpeg&auto=webp"
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
        {
          name: "Après-midi",
          value: "✅\n❌\n❔",
          inline: true
        },
        {
          name: "Légende",
          value: "✅ Présent\n❔ En attente\n❌ Absent\n⏰ Retard (temps)"
        }
      ]
    }
  };
  module.exports = embed_presence_jour;