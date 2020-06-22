'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    nom: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};