const uid = require('uuid/v4');
const moment = require('moment');

const service = require('../service/service');
const firebase = require('../service/firebase');

let query = {
    selector: {
        type: {
            $eq: "project"
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
        project.starttime = moment().toDate()
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
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.status(404).json(err);
    }
}

async function getAllProjects(req, res) {
    try {
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
        query.selector.type.$eq = "event";
        query.selector.project = {$eq: projectID};
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
        query.selector.type.$eq = "donation";
        query.selector.project = {$eq: projectID};
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
        query.selector.type.$eq = "invoice";
        query.selector.project = {$eq: projectID};
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const invoice = JSON.parse(String(result));

        if (invoice) res.json(invoice);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
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