const service = require('../service/service');

async function regisUser(req, res) {
    res.json({'id': "hello world"});
}

async function getDonations(req, res) {
    try {
        const userid = req.params.id;
        const result = await service.getDonationByUserID(userid);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}

async function getProjects(req, res) {
    try {
        const uid = req.params.id;
        const result = await service.getAllProjectsByUserID(uid);
        const projects = JSON.parse(String(result));
        res.json(projects);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getReceiveProject(req, res) {
    try {
        const uid = req.params.id;
        const result = await service.getAllProjectsByReceiverID(uid);
        const projects = JSON.parse(String(result));
        res.json(projects);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    regisUser,
    getProjects,
    getDonations,
    getReceiveProject
}