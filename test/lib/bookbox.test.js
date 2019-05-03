const chaiAsPromised = require('chai-as-promised');
const Bookbox = require('../../src/lib/bookbox');
const Data = require('../resources/data');
const { expect } = require('chai').use(chaiAsPromised);
const Faker = require('faker');
const Users = require('../../src/lib/users');

before(async () => {
  for (let i = 0; i < Data.entries; i++) {
    const user = Data.users[i];
    const username = user.username;
    const password = user.password;
    await Users.createUser(username, password);
  }
});

describe('bookbox', () => {
  it('createBookBox(bookBox)', async () => {
    for (let i = 0; i < Data.entries; i++) {
      const bookbox = Data.bookboxes[i];
      const newBookbox = await Bookbox.createBookBox(bookbox);

      expect(newBookbox).to.be.an('object');
      expect(newBookbox.userid).to.equal(bookbox.userid);
      expect(newBookbox.description).to.equal(bookbox.description);
      expect(newBookbox.location).to.equal(bookbox.location);
      expect(parseFloat(newBookbox.lat)).to.equal(bookbox.lat);
      expect(parseFloat(newBookbox.lng)).to.equal(bookbox.lng);
      expect(newBookbox.imgsrc).to.equal(bookbox.imgsrc);
      expect(newBookbox.hint).to.equal(bookbox.hint);
    }

    await expect(Bookbox.createBookBox(null)).to.eventually.be.null;
    await expect(Bookbox.createBookBox({})).to.be.rejectedWith(Error);
  });

  it('getBookBoxes()', async () => {
    const bookboxes = await Bookbox.getBookBoxes();

    for (let i = 0; i < Data.entries; i++) {
      const bookbox = Data.bookboxes[i];
      const box = bookboxes[i];

      expect(box.userid).to.equal(bookbox.userid);
      expect(box.description).to.equal(bookbox.description);
      expect(box.location).to.equal(bookbox.location);
      expect(parseFloat(box.lat)).to.equal(bookbox.lat);
      expect(parseFloat(box.lng)).to.equal(bookbox.lng);
      expect(box.imgsrc).to.equal(bookbox.imgsrc);
      expect(box.hint).to.equal(bookbox.hint);
    }
  });

  // it('createBookBox(bookBox)', async () => {
  //   for (let i = 0; i < Data.entries; i++) {
  //
  //   }
  // });
});
