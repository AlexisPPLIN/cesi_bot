module.exports = {
    // Commandes
    'cmd_askpresences_desc': "Démarre une période de déclaration de présence dans ce channel textuel",
    'cmd_askpresences_usage': "<heure:minutes début> <heure:minutes fin>",
    'cmd_askpresences_error_overlap' : "Impossible de superposer plusieurs périodes !",
    'cmd_askpresences_error_exists' : "Cette période existe déja !",
    'cmd_delete_desc': "Supprime l’élève dans la liste des élève qui est dans base de donnée",
    'cmd_delete_usage': "<IdDiscord:IdDiscord>",
    'cmd_deleteperiode_desc':"Supprime une période donnée",
    'cmd_deleteperiode_usage': "<periode ID>",
    'cmd_deleteperiode_success': 'Période supprimée avec succès !',
    'cmd_deleteperiode_exists': "Cette période n'existe pas !",
    'cmd_help_desc': 'Liste toutes les commandes ou donne les infos d\'une commande',
    'cmd_help_usage': '[nom de la commande]',
    'cmd_help_list' : 'Voici la liste de toutes mes commandes : ',
    'cmd_help_command_1': 'Vous pouvez envoyer',
    'cmd_help_command_2': 'help [nom de la commande]` pour avoir plus d\'info sur cette commande',
    'cmd_help_dm': 'Je viens de vous envoyer la liste des commandes en MP!',
    'cmd_help_dm_error': 'Je n\'ai pas réussi à vous envoyer un message privé. Avez vous désactivé vos MP ?',
    'cmd_help_not_valid': 'Ce n\'est pas une commande valide !',
    'cmd_help_embed_title': 'Aide de la commande ',
    'cmd_help_embed_aliases' : "Aliases",
    'cmd_help_embed_usage': 'Utilisation',
    'cmd_help_embed_countdown': "Temps d'attente avant nouvelle utilisation",
    'cmd_link_desc': "Ajoute l’élève dans la liste des élève qui est dans base.",
    'cmd_link_usage': '<nom élève> <prénom élève> <discord>',
    'cmd_liste_desc': 'Affiche la liste des élève de la promo dans la base de donnée',
    'cmd_list_aucun': 'Aucun élève enregistré, utilisez `!link`',
    'cmd_listperiodes_desc': 'Donne la liste des périodes d\'une date donnée',
    'cmd_listperiodes_usage': '[date dd/mm/yyyy]',
    'cmd_presences_desc': 'Envoi un mp à l’intervenant avec tous les absent, les present et les retard',
    'cmd_presences_usage': '<ID>',
    'cmd_present_desc': 'permet à l’élève de déclarer les présences.envoi un mp à l\'élève pour confirmer la présence.',
    'cmd_present_error_not_student': 'Vous n\'êtes pas dans la liste des étudiants',
    'cmd_present_error_no_class': 'Il n\'y a aucun cours en ce moment',
    'cmd_present_error_already': 'Vous avez déja déclaré votre présence pour ce cours',
    'cmd_present_embed_title': 'Confirmation déclaration de présence',
    'cmd_link_success': 'Cet élève a bien été ajouté à la liste !',
    'cmd_link_error_exists': 'Cet élève existe déja !',
    'cmd_link_error_autre_mention': 'Merci de mettre une mention d\'un utilisateur !',
    'cmd_delete_success': 'Cet élève a bien été supprimé de la liste !',
    'cmd_delete_error_exists': 'Cet élève n\'existe pas!',
    'cmd_tutorial_desc': "Affiche un tutoriel d'utilisation du bot",

    // Exceptions
    'exception_argument_format': "Un des arguments n'a pas été bien formaté",
    'exception_end_before_start': "Le temps de fin se trouve avant le temps de début !",
    'exception_time_passed': "Cette période c'est déja déroulée",
    'cmd_AucunEleveError': "Il n'y a aucun élève a cette période !",
    'exception_too_many_arguments' : "Vous avez dépassé le nombre d'argument maximal pour cette commande !",
    'exception_not_allowed': "Vous n'avez pas la permission d'executer cette commande",

    // Others
    'student' : 'Étudiant',
    'not_correct_server': "Vous ne pouvez pas utiliser ce bot sur un autre serveur !",
    'not_allowed_in_dm': "Vous ne pouvez pas executer cette commande en MP !"

}