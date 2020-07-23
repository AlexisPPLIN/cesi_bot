function link(message, client ,MessageMinuscule,db,STATUT)
{
    commandeLink = message.content.substr(6);//mets la chaine sans le debut '!link'

var NomCommande = commandeLink.slice(0, commandeLink.indexOf(' '))//prend la partie de la chaine a partir de 0 jusqua l'espace
commandeLink = commandeLink.substr(commandeLink.indexOf(' ') + 1);//supprime le debut de la chaine

var PrenomCommande = commandeLink.slice(0, commandeLink.indexOf(' ')) //prend la partie de la chaine a partir de 0 jusqua l'espace

commandeLink = commandeLink.substr(commandeLink.indexOf(' '));


var IdDiscordCommande = commandeLink.slice(4, commandeLink.indexOf('>'))//prend la partie de la chaine a partir de 1 jusqua la fin





//console.log("essai:/" + NomCommande + "/   prenon:/" + PrenomCommande + "/  id:/" + IdDiscordCommande);

db.Utilisateur
    .findOrCreate({ where: { id_discord: IdDiscordCommande }, defaults: { nom: NomCommande, prenom: PrenomCommande, RoleId: '1' } })
    .then(([Utilisateur, created]) => {

        console.log("test cree");
        console.log(Utilisateur.get({ plain: true }))
        console.log("user cree");
        console.log(created)
    })

}

module.exports = link;