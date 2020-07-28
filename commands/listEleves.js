const appRoot = require('app-root-path');
const lang = require(appRoot+'/lang/Language');
const db = require(appRoot+'/models/index');

embed_liste_etudiant = require(appRoot+'/embed/embed_liste_etudiant.js');
embed_confirmation_presence_mp = require(appRoot+'/embed/embed_confirmation_presence_MP.js');

const STATUT = {
	RETARD: 1,
	PRESENT: 2,
	EN_ATTENTE: 3,
	ABSENT: 4
};

module.exports = {
    name: "listeleves",
    aliases: ['le','list'],
    description: lang.get('cmd_liste_desc'),
    args: false,
    usage: "",
    allowed_in_dm: true,
    execute(message, args) {
        //Pass the arguments to the PresenceSupervisor and return errors if needed
     try {
            

        db.Utilisateur.findAll({ where: { RoleId: '1' }, order : [['nom','ASC']] }).then(Utilisateur => {
            let ListeNom = "";
            let ListePrenom = "";
            let ListeTagDiscord = "";
            for (let i = 0; i < Utilisateur.length; i++) {
                ListeNom += Utilisateur[i].nom + "\n";
                ListePrenom += Utilisateur[i].prenom + "\n"
                ListeTagDiscord += " <@" + Utilisateur[i].id_discord + ">\n";
            }
            if(ListeNom === "") ListeEtudiantChaine = lang.get('cmd_list_aucun')

            embed_liste_etudiant.embed.fields[0].value = ListeNom;
            embed_liste_etudiant.embed.fields[1].value = ListePrenom;
            embed_liste_etudiant.embed.fields[2].value = ListeTagDiscord;
            message.channel.send({ embed: embed_liste_etudiant.embed });
    
        }).catch(() => {
            console.log("erreur dans  listEleves.js");
        })



        } catch (e) {

            console.log("erreur:" + e);
        }
    },
}