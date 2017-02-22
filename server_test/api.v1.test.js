let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;
let userpostrequest = {
    'userId': 0,
    'firstName': 'Test',
    'lastName': 'Test',
    'userName': 'testingtest'
};
let productpostrequest = {
    'productId': 0,
    'name': 'iPhone 6',
    'category': 'SMARTPHONE',
    'unitPrice': 9.5,
    'dateAdded': '1985-04-12T23:20:50.52Z',
    'popular': true,
    'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'defaultImageId': 100,
    'images': [0]
};
let imagepostrequest = {
    'imageId': 0,
    'productId': 0,
    'defaultImage': false,
    'imageData': 'data:image/png;base64,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'
};
chai.use(chaiHttp);
describe('users', () => {
    beforeEach((done) => {
        done();
    });
});
describe('products', () => {
    beforeEach((done) => {
        done();
    });
});
describe('images', () => {
    beforeEach((done) => {
        done();
    });
});
describe('orders', () => {
    beforeEach((done) => {
        done();
    });
});
describe('orderitems', () => {
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
 describe('/GET products', () => {
      it('it should GET all the products', (done) => {
        chai.request(server)
            .get('/api/v1/products')
            .end((err, res) => {
                expect(res).to.have.status(201);
              done();
            });
      });
  });
  describe('/GET images', () => {
      it('it should GET all the images', (done) => {
        chai.request(server)
            .get('/api/v1/images')
            .end((err, res) => {
                expect(res).to.have.status(201);
              done();
            });
      });
  });
  describe('/GET orderitems', () => {
      it('it should GET all the order items', (done) => {
        chai.request(server)
            .get('/api/v1/order-items')
            .end((err, res) => {
                expect(res).to.have.status(201);
				 expect(err).to.be.null;
              done();
            });
      });
  });
  describe('/GET orders', () => {
      it('it should GET all the orders', (done) => {
        chai.request(server)
            .get('/api/v1/orders')
            .end((err, res) => {
                expect(res).to.have.status(201);
              done();
            });
      });
  });
//Post Requests Testing
describe('/POST users', () => {
      it('it should POST a new user', (done) => {
        chai.request(server)
            .post('/api/v1/users')
			.send(userpostrequest)
            .end((err, res) => {
                expect(res).to.have.status(201);
              done();
            });
      });
  });
describe('/POST images', () => {
      it('it should POST a new image', (done) => {
        chai.request(server)
            .post('/api/v1/images')
			.send(imagepostrequest)
            .end((err, res) => {
                expect(res).to.have.status(201);
              done();
            });
      });
  });
  describe('/POST products', () => {
      it('it should POST a new product', (done) => {
        chai.request(server)
            .post('/api/v1/products')
			.send(productpostrequest)
            .end((err, res) => {
                expect(res).to.have.status(201);
              done();
            });
      });
  });
  //Delete Requests
  describe('/Delete user', () => {
      it('it should delete a user', (done) => {
        chai.request(server)
            .del('/api/v1/users/testingtest')
            .end((err, res) => {
                expect(res).to.have.status(204);
              done();
            });
      });
  });
  describe('/Delete products', () => {
      it('it should delete a  product', (done) => {
        chai.request(server)
            .del('/api/v1/products/0')
            .end((err, res) => {
                expect(res).to.have.status(204);
              done();
            });
      });
  });
describe('/Delete images', () => {
      it('it should delete a  image', (done) => {
        chai.request(server)
            .del('/api/v1/images/0')
            .end((err, res) => {
                expect(res).to.have.status(204);
              done();
            });
      });
  });