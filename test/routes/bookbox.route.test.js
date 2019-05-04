const Data = require('../resources/data');
const HttpStatus = require('http-status-codes');
const User = require('../../src/lib/users');
const { agent, expect } = require('chai');

describe('routes/user.route', () => {
  before(async () => {
    await Data.drop();
    await Data.initUsers();
    await Data.initBookboxes();

    for (let i = 0; i < Data.users.length; i++) {
      const user = Data.users[i];

      const base64 = Buffer.from(user.username + ':' + user.password, 'utf-8').toString('base64');
      const auth = `Basic ${base64}`;
      const response = await agent.post(`/users/auth`).set('authorization', auth);

      expect(response).to.have.status(HttpStatus.OK);
      expect(response).to.be.json;

      const result = response.body;

      expect(result.user.id).to.equal(user.id);
      expect(result.user.username).to.equal(user.username);

      user.token = result.token;
    }
  });

  it('GET /bookboxes', async () => {
    const response = await agent.get('/bookboxes');

    expect(response).to.have.status(HttpStatus.OK);
    expect(response).to.be.json;

    const result = response.body;
    const strippedResult = result.map(el => ({
      description: el.description,
      hint: el.hint,
      imgsrc: el.imgsrc,
      lat: parseFloat(el.lat),
      lng: parseFloat(el.lng),
      location: el.location,
      userid: el.userid
    }));

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(Data.bookboxes.length);
    expect(strippedResult).to.eql(Data.bookboxes);
  });

  it('GET /bookboxes/user/:id', async () => {
    for (let i = 0; i < Data.users.length; i++) {
      const user = Data.users[i];

      const auth = `Bearer ${user.token}`;

      const response = await agent.get(`/bookboxes/user/${user.id}`).set('authorization', auth);

      expect(response).to.have.status(HttpStatus.OK);
      expect(response).to.be.json;

      const result = response.body;
      const ids = result.map(el => el.id);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(user.created.length);
      expect(ids).to.eql(user.created);
    }
  });
});
