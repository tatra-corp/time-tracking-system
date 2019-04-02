const { describe } = require('mocha');
const request = require('supertest');
const app = require('../src/server/app');

// These test are not unit, so don't expect anything smart here. Probably it's called integration tests;

describe('App', () => {
  describe('#post/records', () => {
    it('should return 200 in response to start timer request, even if data is corrupted', () => request(app)
      .post('/records')
      .field('username', 'hacker')
      .field('project_name', 'site')
      .field('task_name', 'working')
      .field('action', 'start')
      .field('start_time', '-10')
      .field('stop_time', '10')
      .expect(200));
  });
});

describe('App', () => {
  describe('#get/records?offset=0&limit=10', () => {
    it('should return 200 in response to ask for records', () => request(app)
      .get('/records?offset=0&limit=10')
      .expect(200));
  });
});

describe('App', () => {
  describe('#get/records?offset=-1&limit=10', () => {
    it('should return 400 in response to ask for records with negative offset', () => request(app)
      .get('/records?offset=-1&limit=10')
      .expect(400));
  });
});

describe('App', () => {
  describe('#get/records?offset=0&limit=0', () => {
    it('should return 200 in response to ask for records with 0 limit', () => request(app)
      .get('/records?offset=0&limit=0')
      .expect(200));
  });
});

describe('App', () => {
  describe('#get/records?offset=0&limit=-1', () => {
    it('should return 400 in response to ask for records with negative limit', () => request(app)
      .get('/records?offset=0&limit=-1')
      .expect(400));
  });
});
