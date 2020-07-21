function deleteEtudiant(message, client ,MessageMinuscule,db,STATUT)
{
commandeLink = message.content.substr(6);//mets la chaine sans le debut '!link'

var PrenomCommande = commandeLink.slice(0, commandeLink.indexOf(' ')) //prend la partie de la chaine a partir de 0 jusqua l'espace
commandeLink = commandeLink.substr(commandeLink.indexOf(' '));
var IdDiscordCommande = commandeLink.slice(4, commandeLink.indexOf('>'))//prend la partie de la chaine a partir de 1 jusqua la fin
db.Utilisateur.findOne({ where: { id_discord: IdDiscordCommande } }).then(Utilisateur => {

    return Utilisateur.destroy();
});
}
module.exports = deleteEtudiant;