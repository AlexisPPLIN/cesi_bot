'use strict';
module.exports = (sequelize, DataTypes) => {
  const Presence = sequelize.define('Presence', {
    date_arrive: DataTypes.DATE,
  }, {});
  Presence.associate = function(models) {
    Presence.belongsTo(models.Utilisateur);
    Presence.belongsTo(models.Periode);
    Presence.belongsTo(models.Statut);
  };
  return Presence;
};