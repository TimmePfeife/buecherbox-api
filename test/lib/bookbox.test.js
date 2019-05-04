const chaiAsPromised = require('chai-as-promised');
const Bookbox = require('../../src/lib/bookbox');
const Data = require('../resources/data');
const { expect } = require('chai').use(chaiAsPromised);

describe('lib/bookbox', () => {
  before(async () => {
    await Data.drop();
    await Data.initUsers();
  });

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

  it('getBookBoxesByUser(userId)', async () => {
    for (let i = 0; i < Data.entries; i++) {
      const user = Data.users[i];
      const bookboxList = await Bookbox.getBookBoxesByUser(user.id);
      const ids = bookboxList.map(box => box.id);

      expect(ids).to.eql(user.created);
    }
  });

  it('getFavoritesbyUser(userId)', async () => {
    await Data.initFavorites();

    for (let i = 0; i < Data.entries; i++) {
      const user = Data.users[i];
      const favoritesList = await Bookbox.getFavoritesbyUser(user.id);
      const ids = favoritesList.map(box => box.id);

      expect(ids).to.eql(user.favorites.map(fav => fav.bookboxid));
    }
  });
});
