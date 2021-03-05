require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token = signInData.body.token; // eslint-disable-line

      return done();
    });

    afterAll(done => {
      return client.end(done);
    });



    test('returns characters', async () => {

      await fakeRequest(app)
        .get('/character')
        .expect('Content-Type', /json/)
        .expect(200);

    });


    test('Adds a lotr character to the user favorites', async () => {

      const favorite = {
        name: 'Gandalf',
        race: 'Maiar',
        birth: 'Before the the Shaping of Arda',
        death: 'January 253019 ,Battle of the Peak immortal',
        hair: 'Grey, later white',
        wikiUrl: 'http://lotr.wikia.com//wiki/Gandalf',
        _id: '5cd99d4bde30eff6ebccfea0',
      };

      const characterFavorite = [{
        ...favorite,
        id: 1,
        owner_id: 2
      }];

      const data = await fakeRequest(app)
        .post('/api/favorites')
        .set({ Authorization: token })
        .send(favorite)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(characterFavorite);
    });

    test.skip('Deletes a character from the user favorites by ID', async () => {

      const expectation = {
        name: 'Gandalf',
        race: 'Maiar',
        birth: 'Before the the Shaping of Arda',
        death: 'January 253019 ,Battle of the Peak immortal',
        hair: 'Grey, later white',
        wikiUrl: 'http://lotr.wikia.com//wiki/Gandalf',
        _id: '5cd99d4bde30eff6ebccfea0',
      };

      const data = await fakeRequest(app)
        .delete('/api/favorites/1')
        .set({ Authorization: token })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

  });
});

