let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;
let userpostrequest = require('../raml/api/v1/users/user.example.json');
let productpostrequest = require('../raml/api/v1/products/product.example.json');
let imagepostrequest = require('../raml/api/v1/images/image.example.json');
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
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
                expect(err).to.be.null();
                done();
            });
    });
});
