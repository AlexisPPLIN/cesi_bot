'use strict';
module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define('Utilisateur', {
    prenom: DataTypes.STRING,
    nom: DataTypes.STRING,
    id_discord: DataTypes.INTEGER
  }, {});
  Utilisateur.associate = function(models) {
    Utilisateur.belongsTo(models.Role);
    Utilisateur.hasMany(models.Presence);
  };

  return Utilisateur;
};