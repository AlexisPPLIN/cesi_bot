'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Statuts', [{
      id: 1,
      nom: 'Présent',
      description: 'l\'élève est présent dans le cours',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Statuts', {id : 1}, {});
  }
};
