let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
describe('users', () => {
    beforeEach((done) => {
        done();    
    });
});
  describe('/GET users', () => {
      it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/api/v1/users')
            .end((err, res) => {
                expect(res).to.have.status(201);
              done();
            });
      });
  });
