const uid = require('uuid/v4');
const moment = require('moment');
const schedlue = require('node-schedule');
const service = require('../service/service');
const firebase = require('../service/firebase');

function queryObj() {
    return {
        selector: {
            type: {
                $eq: ""
            }
        }
    }
}

async function createProject(req, res) {
    try {
        const user = req.body.owner;
        const project = req.body;

        // Generate key for project
        // และกำหนดค่าเริ่มต้น
        project.id = 'p_' + uid();
        project.balance = 0;
        project.status = 'pending';
        project.starttime = moment().toDate().toISOString();
        // project.endtime = '11-08-2019:12:00:00';

        const result = await service.createProject(user, project);
        await firebase.saveProject(project);
        res.status(201).json(JSON.parse(String(result)));
    } catch (err) {
        res.status(500).json(err);
    }
}

async function updateProject(req, res) {
    try {
        const userID = req.body.owner;
        const project = {
            id: req.body.id,
            title: req.body.title,
            detail: req.body.detail
            // TODO อาจจะให้แก้ใขได้มากกว่านี้
        }

        const block = service.updateProject(userID, project);
        const db = firebase.updateProject(project);
        const results = await Promise.all([block, db]);
        res.json(results);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function updateProjectStatus(req, res) {
    try {
        const userID = req.body.user;
        const projectID = req.body.project;
        const status = req.body.status;
        const result = await service.updateProjectStatus(userID, projectID, status);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.status(500).json(err);
    }
}

async function deleteProject(req, res) {
    try {
        const userID = req.body.user;
        const projectID = req.body.project;
        const result = await service.deleteProject(userID, projectID);
        res.send(String(result));
    } catch (err) {
        res.status(404).json(err);
    }
}

async function getAllProjects(req, res) {
    try {
        const query = queryObj();
        query.selector.type.$eq = "project";
        const queryString = JSON.stringify(query);
        const result = await service.queryWithSelector(queryString);
        const projests = JSON.parse(String(result));

        if (projests) res.json(projests);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getProjectByID(req, res) {
    try {
        const projectID = req.params.project;
        const result = await service.query(projectID);
        const project = JSON.parse(String(result));

        if (project) res.json(project);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getProjectEvents(req, res) {
    try {
        const projectID = req.params.project;
        const query = queryObj();
        query.selector.type.$eq = "event";
        query.selector.project = { $eq: projectID };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const events = JSON.parse(String(result));

        if (events) res.json(events);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getProjectDonations(req, res) {
    try {
        const projectID = req.params.project;
        const query = queryObj();
        query.selector.type.$eq = "donation";
        query.selector.project = { $eq: projectID };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const donations = JSON.parse(String(result));

        if (donations) res.json(donations);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getProjectInvoices(req, res) {
    try {
        const projectID = req.params.project;
        const query = queryObj();
        query.selector.type.$eq = "invoice";
        query.selector.project = { $eq: projectID };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const invoice = JSON.parse(String(result));

        if (invoice) res.json(invoice);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
}

/**
 * Check time has expired.
 */
async function checkProjectIfTimeout() {
    try {
        console.info('[check] check if project is timeout.');
        const query = queryObj();
        query.selector.type.$eq = "project";
        query.selector.status = { $eq: 'open' };
        const result = await service.queryWithSelector(JSON.stringify(query));
        const projects = JSON.parse(String(result));

        projects.forEach(project => {
            const endtime = moment(project.endtime, moment.ISO_8601);
            if (endtime.diff(moment()) <= 0) {
                console.info(`[check] project ${project.id} is timeout.`);
                if (project.accumulated < project.goal) { // ถ้ายอดสะสมไม่ถึงเป้าหมาย
                    service.payBack(project.id);
                } else {
                    service.closeProject(project.id); // ทำการปิดโปรเจค
                }
            }
        });
    } catch (error) {
        console.error('[check] ' + error);
    }
}

if (process.env.ORG == "Org2") {
    schedlue.scheduleJob('*/30 * * * * *', async () => {
        await checkProjectIfTimeout();
    });
}

module.exports = {
    createProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
    getAllProjects,
    getProjectByID,
    getProjectEvents,
    getProjectDonations,
    getProjectInvoices
}