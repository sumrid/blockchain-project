// Lib
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
// To mock
const service = require('../src/service');
const firebase = require('../src/service.firebase');
const mock = require('./mock.data');

// const server = require('../src/main');

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

    test('create project success', () => {
    //     let project = mock.project;
    //     serviceStub.createProject.withArgs(project).resolves(Buffer.from(JSON.stringify(project)));
    //     serviceStub.getAllProjects.resolves(Buffer.from(JSON.stringify([project, project])));
    //     firebaseStub.saveProject.withArgs(project).resolves();
    //     sinon.replace(service, 'createProject', serviceStub.createProject);
    //     sinon.replace(firebase, 'saveProject', firebaseStub.saveProject);
    //     sinon.replace(service, 'getAllProjects', serviceStub.getAllProjects);

    //     chai.request(server)
    //     .post('/api/project')
    //         .send(project)
    //         .end((err, res) => {
    //             // res.status.should.equal(201);
    //             console.log(res.status);
                // expect(true).toEqual(true);
    //             done();
    //         });
    });
});