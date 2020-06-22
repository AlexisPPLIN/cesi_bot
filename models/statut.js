'use strict';
module.exports = (sequelize, DataTypes) => {
  const Statut = sequelize.define('Statut', {
    nom: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Statut.associate = function(models) {
    // associations can be defined here
  };
  return Statut;
};