// Lib for testing
const chai = require('chai');
const chaihttp = require('chai-http');

// To mock
const mock = require('./mock.data');
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
            expect(res.status).toEqual(200);
            expect(res.text).toEqual('Hello world! from home');
        } catch (err) {
            throw err;
        }
    });

    test('create project success.', async () => {
        // mock
        const project = { id: '001', name: 'hello' };
        service.createProject.mockResolvedValue(Buffer.from(JSON.stringify(project)));
        firebase.saveProject.mockResolvedValue(Buffer.from(JSON.stringify(project)));

        const res = await chai.request(server)
            .post('/api/project')
            .send(project);

        expect(res.status).toEqual(201);
        expect(res.body).toEqual(project);
    });

    test('create project fails.', async () => {
        // mock
        const project = { id: '001', name: 'hello' };
        service.createProject.mockRejectedValue(new Error('Some error'));
        firebase.saveProject.mockResolvedValue(Buffer.from(JSON.stringify(project)));

        const res = await chai.request(server)
            .post('/api/project')
            .send(project);

        expect(res.status).toEqual(500);
    });

    test('donation should success.', async () => {
        // mock
        service.donate.mockResolvedValue('Success.');

        const res = await chai.request(server)
            .post('/api/project/donate')
            .send({ hi: 'hello' });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual('Success.');
    });

    test('donation should fails.', async () => {
        // mock
        service.donate.mockRejectedValue(new Error('Some fails.'));

        const res = await chai.request(server)
            .post('/api/project/donate')
            .send({ hi: 'hello' });

        expect(res.status).toEqual(500);
        expect(res.body.message).toEqual('Some fails.');
    });

    test('get all project should success.', async () => {
        // mock
        const projects = [mock.project];
        service.getAllProjects.mockResolvedValue(Buffer.from(JSON.stringify(projects)));

        const res = await chai.request(server)
            .get('/api/project');

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(projects);
        expect(res.body.length).toEqual(1);
    });

    test('get all project should fails.', async () => {
        // mock
        service.getAllProjects.mockRejectedValue(new Error('Some error.'));

        const res = await chai.request(server)
            .get('/api/project');

        expect(res.status).toEqual(500);
        expect(res.body.message).toEqual('Some error.');
    });

    test('query should success.', async () => {
        // mock
        service.query.mockImplementation((key) => {
            return Promise.resolve(Buffer.from(JSON.stringify({ key: key })));
        });

        const res = await chai.request(server)
            .get('/api/query/001');

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ key: '001' });
    });

    test('query should fails.', async () => {
        // mock
        service.query.mockRejectedValue(new Error('Some error.'));

        const res = await chai.request(server)
            .get('/api/query/001');

        expect(res.status).toEqual(500);
        expect(res.body.message).toEqual('Some error.');
    });

    test('', async () => {
        const s = chai.request(server);
        
        setTimeout(async () => {
            const res = await s.get('/api');
            console.log(res.text);

        }, 5000);
    });

    afterEach(() => {
        jest.resetAllMocks()
    });
});
