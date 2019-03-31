const describe = require('mocha').describe
const request = require('supertest')
const app = require('../src/server/app')

// These test are not unit, so don't expect anything smart here. Probably it's called integration tests;

describe('App', function () {
  describe('#post/records', function () {
    it('should return 200 in response to start timer request, even if data is corrupted', function () {
      return request(app)
        .post('/records')
        .field('username', 'hacker')
        .field('project_name', 'site')
        .field('task_name', 'working')
        .field('action', 'start')
        .field('start_time', '-10')
        .field('stop_time', '10')
        .expect(200);
    })
  })
})