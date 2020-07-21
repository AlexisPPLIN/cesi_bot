embed_liste_etudiant = require(__dirname + '/../embed\\embed_liste_etudiant.js');

function liste_eleve(message, client ,MessageMinuscule,db,STATUT) 
{

    db.Utilisateur.findAll({ where: { RoleId: '1' } }).then(Utilisateur => {
        var ListeEtudiantChaine = "";
        for (let i = 0; i < Utilisateur.length; i++) {
            ListeEtudiantChaine = ListeEtudiantChaine + "🎓" + Utilisateur[i].nom + " " + Utilisateur[i].prenom + " <@" + Utilisateur[i].id_discord + "> \n";
        }
        embed_liste_etudiant.embed.fields[0].value = ListeEtudiantChaine;
        message.channel.send({ embed: embed_liste_etudiant.embed });

    })


};


module.exports = liste_eleve;