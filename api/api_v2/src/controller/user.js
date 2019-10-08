const validator = require('validator');
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
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role || "";

    try {
        const user = await firebase.registerUser(name, email, password);
        const setRole = firebase.setUser(user.uid, name, role);
        const regisCA = register.regis(user.uid);
        const addToBlock = service.addUser(user.uid, role);
        firebase.sendConfirmEmail(email);
        await Promise.all([setRole, regisCA, addToBlock]);
        res.json({ user: user });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function updateUser(req, res) {
    try {
        const uid = req.params.id;
        await firebase.updateUser(uid, req.body);
        res.json({ uid, ...req.body });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function deleteUser(req, res) {
    try {
        const uid = req.params.id;
        // Input email or uid
        
        // delete in world state
        // auth
        // firestore
        res.json({ uid });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function verifyUserIDCard(req, res) {
    try {
        const user = req.params.id;
        const checker = req.body.checker;
        const verifyState = req.body.verify;

        const result = await service.changeUserVerifyState(checker, user, verifyState);
        const payload = JSON.parse(String(result));
        firebase.updateUser(user, { verifyIDCard: true, verifyID_tx: payload.txid });

        res.json(payload);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getUser(req, res) {
    try {
        const input = req.params.id;
        const isEmail = validator.isEmail(input);
        if (isEmail) {
            const user = await firebase.getUserByEmail(input);
            const isExsits = await register.checkUserExists(user.uid);
            if (isExsits) {
                const userAsBuffer = await service.query(user.uid);
                const userBlock = JSON.parse(String(userAsBuffer));
                res.json({ ...user, ...userBlock });
            }
            else {
                res.status(404).json({ message: "user not found." });
            }
        } else {
            const isExsits = await register.checkUserExists(input);
            if (isExsits) {
                const user = await firebase.getUserByUID(input);
                const userAsBuffer = await service.query(input);
                const userBlock = JSON.parse(String(userAsBuffer));
                res.json({ ...user, ...userBlock });
            }
            else {
                res.status(404).json({ message: "user not found." });
            }
        }
    } catch (error) {
        res.status(404).json(error);
    }
}

async function getAllUsers(req, res) {
    try {
        const query = queryObj();
        query.selector.type.$eq = "user";
        const queryString = JSON.stringify(query);

        const results = await service.queryWithSelector(queryString);
        const users = JSON.parse(String(results));

        if (users) res.json(users);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
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
    deleteUser,
    updateUser,
    getAllUsers,
    getProjects,
    getDonations,
    verifyUserIDCard,
    getReceiveProject,
}