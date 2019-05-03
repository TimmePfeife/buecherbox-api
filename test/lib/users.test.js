const { expect } = require('chai');
const Faker = require('faker');
const Users = require('../../src/lib/users');

const MAX_USERS = 10;
const userList = [];

before(() => {
  for (let i = 0; i <= MAX_USERS; i++) {
    userList.push({
      username: Faker.internet.userName(),
      password: Faker.internet.password(),
      deleted: Faker.random.boolean()
    });
  }
});

describe('users', () => {
  it('createUser(user, credentials)', async () => {
    for (let i = 0; i < MAX_USERS; i++) {
      const username = userList[i].username;
      const password = userList[i].password;

      const noCredentials = await Users.createUser(username);
      expect(noCredentials).to.be.null;

      const newUser = await Users.createUser(username, password);
      expect(newUser).to.be.an('object');
      expect(newUser.id).to.equal(i + 1);
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
    for (let i = 0; i < MAX_USERS; i++) {
      const username = userList[i].username;
      const password = userList[i].password;
      const base64 = Buffer.from(username + ':' + password, 'utf-8').toString('base64');

      const auth = Users.getCredentials('Basic ' + base64);
      expect(auth[0]).to.equal(username);
      expect(auth[1]).to.equal(password);
    }
  });

  it('authenticateJwt(jwt)', () => {
    for (let i = 0; i < MAX_USERS; i++) {
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
    for (let i = 0; i < MAX_USERS; i++) {
      const username = userList[i].username;
      const password = userList[i].password;
      const user = await Users.authenticateUser(username, password);

      expect(user).to.be.an('object');
      expect(user.token).to.be.an('string');
      expect(user.user).to.be.an('object');
      expect(user.user.username).to.equal(username);

      const error = await Users.authenticateUser(username, Faker.internet.password());

      expect(error).to.be.null;
    }
  });

  it('deleteUser(userId)', async () => {
    for (let i = 0; i < MAX_USERS; i++) {
      if (userList[i].deleted) {
        await Users.deleteUser(i + 1);
      }
    }
  });

  it('getUser(userId)', async () => {
    for (let i = 0; i < MAX_USERS; i++) {
      const noUser = await Users.getUser(Faker.random.number() + MAX_USERS);
      expect(noUser).to.be.null;

      const id = i + 1;
      const user = await Users.getUser(id);

      expect(user).to.be.an('object');
      expect(user.id).to.equal(id);
      expect(user.username).to.equal(userList[i].username);
      expect(user.deleted).to.equal(userList[i].deleted);
    }
  });
});
