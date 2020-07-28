'use strict';
module.exports = (sequelize, DataTypes) => {
  const Periode = sequelize.define('Periode', {
    pre_debut: DataTypes.DATE,
    debut: DataTypes.DATE,
    fin: DataTypes.DATE
  }, {});
  Periode.associate = function(models) {
    Periode.hasMany(models.Presence);
  };
  return Periode;
};