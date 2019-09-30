const service = require('../service/service');
const register = require('../service/register');
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

async function regisUser(req, res) {
    console.info(`[${process.env.ORG}] [controller] regisUser`);
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const user = await firebase.registerUser(name, email, password);
        await register.regis(user.uid);
        res.json({ user: user });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getUser(req, res) {
    res.json({ message: "not implemented." });
}

async function getDonations(req, res) {
    try {
        const userid = req.params.id;
        const query = queryObj();
        query.selector.type.$eq = "donation"
        query.selector.user = { $eq: userid };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const donations = JSON.parse(String(result));
        if (donations) res.json(donations);
        else res.status(404).json([]);
    } catch (err) {
        res.json(err);
    }
}

async function getProjects(req, res) {
    try {
        const uid = req.params.id;
        const query = queryObj();
        query.selector.type.$eq = "project"
        query.selector.owner = { $eq: uid };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const projects = JSON.parse(String(result));
        if (projects) res.json(projects);
        else res.status(404).json([]);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getReceiveProject(req, res) {
    try {
        const uid = req.params.id;
        const query = queryObj();
        query.selector.type.$eq = "project";
        query.selector.receiver = { $eq: uid };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const projects = JSON.parse(String(result));
        if (projects) res.json(projects);
        else res.status(404).json([]);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getUser,
    regisUser,
    getProjects,
    getDonations,
    getReceiveProject
}