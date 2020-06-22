'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    nom: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Role.associate = function(models) {
    Role.hasMany(models.Utilisateur);
  };
  return Role;
};