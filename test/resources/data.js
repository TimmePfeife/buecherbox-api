const Faker = require('faker');

const entries = 10;

const users = [];

function init () {
  for (let i = 0; i < entries; i++) {
    users.push({
      id: i + 1,
      username: Faker.internet.userName(),
      password: Faker.internet.password(),
      deleted: Faker.random.boolean()
    });
  }
}

module.exports = {
  init,
  entries,
  users
};
