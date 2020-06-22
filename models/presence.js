'use strict';
module.exports = (sequelize, DataTypes) => {
  const Presence = sequelize.define('Presence', {}, {});
  Presence.associate = function(models) {
    // associations can be defined here
  };
  return Presence;
};