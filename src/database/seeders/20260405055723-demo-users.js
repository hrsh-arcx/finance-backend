'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Harsh Goel',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Riya Sharma',
        email: 'analyst@example.com',
        password: hashedPassword,
        role: 'ANALYST',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Amit Verma',
        email: 'viewer@example.com',
        password: hashedPassword,
        role: 'VIEWER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};