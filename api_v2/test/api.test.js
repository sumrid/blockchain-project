// Lib
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
// To mock
const service = require('../src/service');
const firebase = require('../src/service.firebase');
const mock = require('./mock.data');

// To test
const server = require('../src/main');

chai.use(chaiHttp);

describe('API test', () => {

    afterEach(() => {
        sinon.restore();
    });

    const serviceStub = {};
    serviceStub.createProject = sinon.stub();
    serviceStub.donate = sinon.stub();
    serviceStub.getDonationHistory = sinon.stub();
    serviceStub.getAllProjects = sinon.stub();
    serviceStub.closeProject = sinon.stub();

    const firebaseStub = {};
    firebaseStub.saveProject = sinon.stub();

    test('home', (done) => {
        let project = mock.project;
        serviceStub.createProject.withArgs(project).resolves(Buffer.from(JSON.stringify(project)));
        serviceStub.getAllProjects.resolves(Buffer.from(JSON.stringify([project, project])));
        serviceStub.closeProject.withArgs(project.id).resolves(Buffer.from('Success.'));
        firebaseStub.saveProject.withArgs(project).resolves();
        sinon.replace(service, 'createProject', serviceStub.createProject);
        sinon.replace(service, 'getAllProjects', serviceStub.getAllProjects);
        sinon.replace(service, 'closeProject', serviceStub.closeProject);
        sinon.replace(firebase, 'saveProject', firebaseStub.saveProject);

        chai.request(server)
            .get('/api').end((err, res) => {
                res.text.should.equal('Hello world! from home');
                done();
            });
    });

    test('create project success', (done) => {
        let project = mock.project;
        serviceStub.createProject.withArgs(project).resolves(Buffer.from(JSON.stringify(project)));
        serviceStub.getAllProjects.resolves(Buffer.from(JSON.stringify([project, project])));
        serviceStub.closeProject.withArgs(project.id).resolves();
        firebaseStub.saveProject.withArgs(project).resolves();
        sinon.replace(service, 'createProject', serviceStub.createProject);
        sinon.replace(service, 'getAllProjects', serviceStub.getAllProjects);
        sinon.replace(service, 'closeProject', serviceStub.closeProject);
        sinon.replace(firebase, 'saveProject', firebaseStub.saveProject);

        chai.request(server)
            .post('/api/project')
            .send(project)
            .end((err, res) => {
                res.status.should.equal(201);
                console.log(res.status);
                expect(true).toEqual(true);
                done();
            });
    });
});