const db = require('../database/models');

async function findUserByEmail(email) {
  return db.User.findOne({ where: { email } });
}

async function findAllUsers() {
  return db.User.findAll({
    attributes: { exclude: ['password'] },
  });
}

async function findUserById(id) {
  return db.User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
}

async function findUserByIdWithPassword(id) {
  return db.User.findByPk(id);
}

async function createUser(data) {
  return db.User.create(data);
}

async function saveUser(user) {
  return user.save();
}

module.exports = {
  findUserByEmail,
  findAllUsers,
  findUserById,
  findUserByIdWithPassword,
  createUser,
  saveUser,
};