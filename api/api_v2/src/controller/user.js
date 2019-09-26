const service = require('../service/service');
let query = {
    selector: {
        type: {
            $eq: "project"
        }
    }
}
console.log(JSON.stringify(query));

async function regisUser(req, res) {
    res.json({ 'id': "hello world" });
}

async function getDonations(req, res) {
    try {
        const userid = req.params.id;
        query.selector.type.$eq = "donation"
        query.selector.user = { $eq: "xxx" };

        const result = await service.getDonationByUserID(userid);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}

async function getProjects(req, res) {
    query.selector.owner = { $eq: "xxx" };
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
    query.selector.receiver = { $eq: "xxx" };
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