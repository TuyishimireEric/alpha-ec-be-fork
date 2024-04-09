import chai from 'chai';
import sinon from 'sinon';
import Database from '../src/database';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import path from 'path';

chai.use(chaiHttp);
const { expect } = chai;
let token: string = '';

describe('PRODUCT API TEST', () => {
  before(done => {
    const user = {
      email: 'test1@example.com',
      password: '1111@aa',
    };
    chai
      .request(app)
      .post('/api/users/login')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        token = res.body.data;
        done();
      });
  });

  let productId: string = '';

  it('User should be authenticated', done => {
    const product = {
      name: 'MAZDA',
      category: 'CAR',
    };

    chai
      .request(app)
      .post('/api/products')
      .send(product)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('Product fields should be valid', done => {
    const product = {
      name: 'MAZDA',
      category: 'CAR',
    };

    chai
      .request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('Should create a product', function (done) {
    this.timeout(5000);

    const filePath = path.resolve(__dirname, './assets/typescript.jpeg');
    const product = {
      name: 'MAZDA',
      category: 'CAR',
      price: 5000,
    };

    chai
      .request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', product.name)
      .field('category', product.category)
      .field('price', product.price)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .end((err, res) => {
        expect(res.body.message).to.equal('Product created successfully!');
        done();
      });
  });

  it('Should not create a product twice', function (done) {
    this.timeout(5000);

    const filePath = path.resolve(__dirname, './assets/typescript.jpeg');
    const product = {
      name: 'MAZDA',
      category: 'CAR',
      price: 5000,
    };

    chai
      .request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', product.name)
      .field('category', product.category)
      .field('price', product.price)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'Product already exists, update instead!'
        );
        done();
      });
  });

  it('Should handle server errors during user creation', function (done) {
    this.timeout(5000);
    const findOneStub = sinon
      .stub(Database.Product, 'findOne')
      .throws(new Error('Database error'));

    const filePath = path.resolve(__dirname, './assets/typescript.jpeg');
    const product = {
      name: 'MAZDA',
      category: 'CAR',
      price: 5000,
    };

    chai
      .request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', product.name)
      .field('category', product.category)
      .field('price', product.price)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .end((err, res) => {
        findOneStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should get all products', function (done) {
    chai
      .request(app)
      .get('/api/products')
      .end((err, res) => {
        productId = res.body.data.products[0].id;
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should get all products with conditions', function (done) {
    const conditions = {
      name: 'MAZDA',
      category: 'Cars',
      priceLessThan: 2000,
      sellerId: '35665005-d2e7-4bfc-9bcb-0d8f2af02948',
      priceGreaterThan: 500,
      sort: 'name:asc',
    };
    chai
      .request(app)
      .get('/api/products')
      .query(conditions)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should throw an error while geting all products', function (done) {
    const findAllStub = sinon
      .stub(Database.Product, 'findAll')
      .throws(new Error('Database error'));
    chai
      .request(app)
      .get('/api/products')
      .end((err, res) => {
        findAllStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should get all products with conditions', function (done) {
    const conditions = {
      category: 'Cars',
      priceLessThan: 2000,
      sellerId: '35665005-d2e7-4bfc-9bcb-0d8f2af02948',
      priceGreaterThan: 500,
      sort: 'name:asc',
    };
    chai
      .request(app)
      .get('/api/products')
      .query(conditions)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should get all products with conditions', function (done) {
    const conditions = {
      priceLessThan: 2000,
      sellerId: '35665005-d2e7-4bfc-9bcb-0d8f2af02948',
      priceGreaterThan: 500,
      sort: 'name:asc',
    };
    chai
      .request(app)
      .get('/api/products')
      .query(conditions)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should get all products with conditions', function (done) {
    const conditions = {
      priceLessThan: 2000,
    };
    chai
      .request(app)
      .get('/api/products')
      .query(conditions)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should get a product', function (done) {
    chai
      .request(app)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should return error if a product is not found', function (done) {
    chai
      .request(app)
      .get(`/api/products/3669aace-d388-49dc-bd1a-8ec2885baa22`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should return error if a product is not found', function (done) {
    chai
      .request(app)
      .patch(`/api/products/3669aace-d388-49dc-bd1a-8ec2885baa22`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should return error if a product is not found', function (done) {
    chai
      .request(app)
      .patch(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should handle server errors during user retrieval', function (done) {
    const findOneStub = sinon
      .stub(Database.Product, 'findOne')
      .throws(new Error('Database error'));

    chai
      .request(app)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        findOneStub.restore();

        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should update a product', function (done) {
    chai
      .request(app)
      .patch(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'MAZDA')
      .field('category', 'Cars')
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should throw an error while failed to update a product', function (done) {
    const updateStub = sinon
      .stub(Database.Product, 'update')
      .throws(new Error('Database error'));

    chai
      .request(app)
      .patch(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'MAZDA')
      .field('category', 'Cars')
      .end((err, res) => {
        updateStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should throw while failed to delete a product', function (done) {
    const destroyStub = sinon
      .stub(Database.Product, 'destroy')
      .throws(new Error('Database error'));
    chai
      .request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        destroyStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should delete a product', function (done) {
    chai
      .request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should not delete a product if not found', function (done) {
    chai
      .request(app)
      .delete(`/api/products/3669aace-d388-49dc-bd1a-8ec2885baa22`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should not delete a product if not found', function (done) {
    chai
      .request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });
});