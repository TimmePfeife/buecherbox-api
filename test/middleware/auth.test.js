const Auth = require('../../src/middleware/auth');
const Data = require('../resources/data');
const { expect } = require('chai');
const HttpMocks = require('node-mocks-http');
const HttpStatus = require('http-status-codes');
const Users = require('../../src/lib/users');
const Sinon = require('sinon');

describe('middleware/auth', () => {
  before(async () => {
    await Data.drop();
    await Data.initUsers();
  });

  describe('auth(req, res, next)', () => {
    it('authorized user', async () => {
      for (let i = 0; i < Data.entries; i++) {
        const user = Data.users[i];

        const jwt = Users.createJwt({ id: user.id });
        const token = `Bearer ${jwt}`;
        const authToken = Users.authenticateJwt(token);

        const res = HttpMocks.createResponse();
        const req = HttpMocks.createRequest({
          headers: {
            'authorization': token
          }
        });

        const next = Sinon.fake();
        res.sendStatus = Sinon.fake();

        await Auth(req, res, next);
        expect(next.calledOnce).to.be.true;
        expect(req.token).to.eql(authToken);
        expect(res.sendStatus.called).to.be.false;
      }
    });

    it('unauthorized user', async () => {
      for (let i = 0; i < Data.entries; i++) {
        const user = Data.users[i];

        const jwt = Users.createJwt({ id: user.id });
        const token = `Beare ${jwt}`;

        const res = HttpMocks.createResponse();
        const req = HttpMocks.createRequest({
          headers: {
            'authorization': token
          }
        });

        const next = Sinon.fake();
        res.sendStatus = Sinon.fake();

        await Auth(req, res, next);
        expect(next.calledOnce).to.be.false;
        expect(req.token).to.be.undefined;
        expect(res.sendStatus.calledOnce).to.be.true;
        expect(res.sendStatus.calledWith(HttpStatus.UNAUTHORIZED)).to.be.true;
      }
    });

    it('error', async () => {
      for (let i = 0; i < Data.entries; i++) {
        const res = {};
        const req = {};

        const next = Sinon.fake();
        res.sendStatus = Sinon.fake();

        await Auth(req, res, next);
        expect(next.calledOnce).to.be.false;
        expect(req.token).to.be.undefined;
        expect(res.sendStatus.calledOnce).to.be.true;
        expect(res.sendStatus.calledWith(HttpStatus.UNAUTHORIZED)).to.be.true;
      }
    });
  });
});
