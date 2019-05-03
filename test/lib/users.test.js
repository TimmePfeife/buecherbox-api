const { expect } = require('chai');
const Users = require('../../src/lib/users');

describe('users', () => {
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
