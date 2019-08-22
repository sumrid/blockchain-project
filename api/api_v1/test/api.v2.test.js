const chai = require('chai');
const chaihttp = require('chai-http');

// To mock
const service = require('../src/service');
const firebase = require('../src/service.firebase');
jest.mock('../src/service');
jest.mock('../src/service.firebase');

// To test
const server = require('../src/main');

chai.use(chaihttp);

describe('test controller', () => {

    test('get hello world message.', async () => {
        try {
            const res = await chai.request(server).get('/api');
            console.log(res.body);
            expect(res.status).toEqual(200);
            expect(res.text).toEqual('Hello world! from home');
        } catch (err) {
            throw err;
        }
    });

    test('create project success.', async () => {
        // mock
        const project = {id:'001', name:'hello'};
        service.createProject.mockResolvedValue(Buffer.from(JSON.stringify(project)));
        
        const res = await chai.request(server)
            .post('/api/project')
            .send({ id: '001' });

        expect(res.status).toEqual(201);
        expect(res.body).toEqual(project);
    });
});
