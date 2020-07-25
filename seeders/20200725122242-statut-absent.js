'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Statuts', [{
      id: 2,
      nom: 'Absent',
      description: 'l\'élève est absent au cours',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Statuts', {id : 2}, {});
  }
};
