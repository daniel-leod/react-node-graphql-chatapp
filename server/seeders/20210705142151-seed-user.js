"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: 1,
          username: "john",
          email: "john@test.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: "jane",
          email: "jane@test.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          username: "mike",
          email: "mike@test.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
