const describe = require('mocha').describe
const assert = require('assert')
const request = require('supertest')
const app = require('../src/server/app')
const FormData = require('form-data')

// These test are not unit, so don't expect anything smart here. Probably it's called integration tests;

describe('App', function () {
  describe('#post/records', function () {
    it('should return 200 in response to start timer request, even if data is corrupted', function () {
      // let formData = new FormData();
      // formData.append('username', 'hacker');
      // formData.append('project_name', 'site');
      // formData.append('task_name', 'working');
      // formData.append('action', 'start');
      // formData.append('start_time', '-10');
      // formData.append('stop_time', '10');
      // console.log(formData);
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