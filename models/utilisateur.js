'use strict';
module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define('Utilisateur', {
    prenom: DataTypes.STRING,
    nom: DataTypes.STRING,
    id_discord: DataTypes.INTEGER
  }, {});
  Utilisateur.associate = function(models) {
    // associations can be defined here
  };
  return Utilisateur;
};