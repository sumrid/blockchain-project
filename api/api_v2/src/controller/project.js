const uid = require('uuid/v4');
const moment = require('moment');

const service = require('../service/service');
const firebase = require('../service/firebase');

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

}

async function getProjectByID(req, res) {

}

async function getProjectEvents(req, res) {

}

async function getProjectDonations(req, res) {

}

async function getProjectInvoices(req, res) {

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