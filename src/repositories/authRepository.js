const db = require('../database/models');

async function findUserByEmail(email) {
  return db.User.findOne({ where: { email } });
}

async function findUserById(id) {
  return db.User.findByPk(id);
}

module.exports = {
  findUserByEmail,
  findUserById,
};