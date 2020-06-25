'use strict';
module.exports = (sequelize, DataTypes) => {
  const Periode = sequelize.define('Periode', {
    debut: DataTypes.DATE,
    fin: DataTypes.DATE
  }, {});
  Periode.associate = function(models) {
    Periode.hasMany(models.Presence);
  };
  return Periode;
};