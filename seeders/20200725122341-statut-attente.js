'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Statuts', [{
      id: 3,
      nom: 'En attente',
      description: 'En attente d\'une déclaration de présence',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Statuts', {id : 3}, {});
  }
};
