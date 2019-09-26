const Bookbox = require('../../src/lib/bookbox');
const Db = require('../../src/lib/db');
const Faker = require('faker');
const Users = require('../../src/lib/users');

const entries = 10;

const bookboxes = [];
const users = [];
const favorites = [];

const _created = [];

async function init () {
  _initUsers();
  _initBookboxes();
}

async function drop () {
  await Db.query(Db.sqlScripts['truncate_tables.sql']);
}

function _initUsers () {
  for (let i = 0; i < entries; i++) {
    users.push({
      id: i + 1,
      username: Faker.internet.userName().substring(0, 20),
      password: Faker.internet.password(),
      deleted: Faker.random.boolean(),
      created: [],
      favorites: []
    });
  }
}

async function initUsers () {
  if (!users.length) return;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await Users.createUser(user.username, user.password);
  }
}

async function dropUsers () {
  await Db.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
}

function getUser () {
  return {
    id: -1,
    username: Faker.internet.userName().substring(0, 20),
    password: Faker.internet.password(),
    deleted: Faker.random.boolean(),
    created: [],
    favorites: []
  };
}

function _initBookboxes () {
  for (let i = 0; i < entries; i++) {
    const creatorId = Math.floor(Math.random() * (entries - 1) + 1);

    const user = users.find(el => el.id === creatorId);

    const id = i + 1;

    if (!_created.includes(id)) {
      _created.push((id));
      user.created.push(id);
    }

    if (Faker.random.boolean()) {
      const fav = {
        id: -1,
        bookboxid: id,
        userid: user.id
      };

      user.favorites.push(fav);
      favorites.push(fav);
    }

    bookboxes.push({
      userid: creatorId,
      description: Faker.lorem.slug(),
      location: '',
      lat: parseFloat(Faker.address.latitude()),
      lng: parseFloat(Faker.address.longitude()),
      imgid: null,
      hint: Faker.lorem.lines()
    });
  }
}

async function initBookboxes () {
  if (!bookboxes.length) return;

  for (let i = 0; i < bookboxes.length; i++) {
    await Bookbox.createBookBox(bookboxes[i]);
  }
}

async function initFavorites () {
  if (!favorites.length) return;

  for (let i = 0; i < favorites.length; i++) {
    const fav = favorites[i];
    await Users.addFavorite(fav.userid, fav.bookboxid);
  }
}

module.exports = {
  drop,
  dropUsers,
  getUserById: getUser,
  init,
  initBookboxes,
  initUsers,
  initFavorites,
  entries,
  users,
  bookboxes,
  favorites
};
