'use strict';
module.exports = (sequelize, DataTypes) => {
  const Periode = sequelize.define('Periode', {
    debut: DataTypes.DATE,
    fin: DataTypes.DATE
  }, {});
  Periode.associate = function(models) {
    // associations can be defined here
  };
  return Periode;
};