const Faker = require('faker');

const entries = 10;

const bookboxes = [];
const users = [];

async function init () {
  initUsers();
  await initBookboxes();
}

function initUsers () {
  for (let i = 0; i < entries; i++) {
    users.push({
      id: i + 1,
      username: Faker.internet.userName().substring(0, 20),
      password: Faker.internet.password(),
      deleted: Faker.random.boolean()
    });
  }
}

async function initBookboxes () {
  for (let i = 0; i < entries; i++) {
    const creatorId = Math.floor(Math.random() * (entries - 1) + 1);

    bookboxes.push({
      userid: creatorId,
      description: Faker.lorem.slug(),
      location: '',
      lat: parseFloat(Faker.address.latitude()),
      lng: parseFloat(Faker.address.longitude()),
      imgsrc: '',
      hint: Faker.lorem.lines()
    });
  }
}

module.exports = {
  init,
  entries,
  users,
  bookboxes
};
