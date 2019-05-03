const { expect } = require('chai');
const Data = require('../resources/data');
const Faker = require('faker');
const Users = require('../../src/lib/users');

describe('users', () => {
  it('createUser(user, credentials)', async () => {
    for (let i = 0; i < Data.entries; i++) {
      const user = Data.users[i];
      const username = user.username;
      const password = user.password;

      const noCredentials = await Users.createUser(username);
      expect(noCredentials).to.be.null;

      const newUser = await Users.createUser(username, password);
      expect(newUser).to.be.an('object');
      expect(newUser.id).to.equal(user.id);
      expect(newUser.deleted).to.be.false;

      const auth = await Users.authenticateUser(username, password);

      expect(auth).to.be.an('object');
      expect(auth.token).to.be.an('string');
      expect(auth.user).to.be.an('object');
      expect(auth.user.username).to.equal(username);

      const authError = await Users.authenticateUser(username, Faker.internet.password());
      expect(authError).to.be.null;
    }
  });

  it('getCredentials(auth)', () => {
    for (let i = 0; i < Data.entries; i++) {
      const user = Data.users[i];
      const username = user.username;
      const password = user.password;
      const base64 = Buffer.from(username + ':' + password, 'utf-8').toString('base64');

      const auth = Users.getCredentials('Basic ' + base64);
      expect(auth[0]).to.equal(username);
      expect(auth[1]).to.equal(password);
    }
  });

  it('authenticateJwt(jwt)', () => {
    for (let i = 0; i < Data.entries; i++) {
      const userId = Faker.random.number();
      const token = Users.createJwt(userId);

      const auth = Users.authenticateJwt('Bearer ' + token);

      expect(auth).to.be.an('object');
      expect(auth.id).to.equal(userId);

      const error = Users.authenticateJwt(null);
      expect(error).to.be.null;

      expect(() => Users.authenticateJwt('Bearer ' + userId)).to.throw(Error);
    }
  });

  it('authenticateUser(username, password)', async () => {
    for (let i = 0; i < Data.entries; i++) {
      const user = Data.users[i];
      const username = user.username;
      const password = user.password;
      const auth = await Users.authenticateUser(username, password);

      expect(auth).to.be.an('object');
      expect(auth.token).to.be.an('string');
      expect(auth.user).to.be.an('object');
      expect(auth.user.username).to.equal(username);

      const error = await Users.authenticateUser(username, Faker.internet.password());

      expect(error).to.be.null;
    }
  });

  it('deleteUser(userId)', async () => {
    for (let i = 0; i < Data.entries; i++) {
      if (Data.users[i].deleted) {
        await Users.deleteUser(i + 1);
      }
    }
  });

  it('getUser(userId)', async () => {
    for (let i = 0; i < Data.entries; i++) {
      const user = Data.users[i];

      const noUser = await Users.getUser(Faker.random.number() + Data.entries);
      expect(noUser).to.be.null;

      const dbUser = await Users.getUser(user.id);

      expect(dbUser).to.be.an('object');
      expect(dbUser.id).to.equal(user.id);
      expect(dbUser.username).to.equal(user.username);
      expect(dbUser.deleted).to.equal(user.deleted);
    }
  });
});
