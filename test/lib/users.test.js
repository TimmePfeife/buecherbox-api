const { expect } = require('chai');
const Users = require('../../src/lib/users');

describe('users', () => {
  it('getCredentials(auth)', () => {
    const username = 'Test';
    const password = 'password';
    const base64 = Buffer.from(username + ':' + password, 'utf-8').toString('base64');

    const auth = Users.getCredentials('Basic ' + base64);
    expect(auth[0]).to.equal(username);
    expect(auth[1]).to.equal(password);
  });

  it('authenticateJwt(jwt)', () => {
    const userId = 1234;
    const token = Users.createJwt(userId);

    const auth = Users.authenticateJwt('Bearer ' + token);

    expect(auth).to.be.an('object');
    expect(auth.id).to.equal(userId);

    const error = Users.authenticateJwt(null);
    expect(error).to.be.null;

    expect(() => Users.authenticateJwt('Bearer ' + 1234)).to.throw(Error);
  });

  it('authenticateUser(username, password)', async () => {
    const username = 'TEST_USER';
    const password = '123456';
    const user = await Users.authenticateUser(username, password);

    expect(user).to.be.an('object');
    expect(user.token).to.be.an('string');
    expect(user.user).to.be.an('object');
    expect(user.user.username).to.equal(username);

    const error = await Users.authenticateUser(username, 'asgdaskjd');

    expect(error).to.be.null;
  });

  it('createUser(user, credentials)', async () => {
    const noCredentials = await Users.createUser(null);
    expect(noCredentials).to.be.null;

    const username = 'NEW_TEST_USER';
    const password = 'NEW_TEST_PASSWORD';

    const newUser = await Users.createUser(username, password);
    expect(newUser).to.be.an('object');
    expect(newUser.id).to.equal(3);
    expect(newUser.deleted).to.be.false;

    const auth = await Users.authenticateUser(username, password);

    expect(auth).to.be.an('object');
    expect(auth.token).to.be.an('string');
    expect(auth.user).to.be.an('object');
    expect(auth.user.username).to.equal(username);

    const authError = await Users.authenticateUser(username, '123');
    expect(authError).to.be.null;
  });

  it('getUser(userId)', async () => {
    const noUser = await Users.getUser(0);
    expect(noUser).to.be.null;

    const user = await Users.getUser(1);
    expect(user).to.be.an('object');
    expect(user.id).to.equal(1);
    expect(user.deleted).to.be.false;

    const deletedUser = await Users.getUser(2);
    expect(deletedUser).to.be.an('object');
    expect(deletedUser.id).to.equal(2);
    expect(deletedUser.deleted).to.be.true;
  });
});
