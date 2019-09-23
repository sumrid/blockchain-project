const moment = require('moment');
const service = require('./service');
const validator = require('validator');
const firebase = require('./service.firebase');
const DATETIME_LAYOUT = 'DD-MM-YYYY:HH:mm:ss';

exports.registerReceiver = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const user = await firebase.registerUser(name, email, password);
        await service.registerReceiver(user.uid);
        await firebase.setUser(user.uid, ["receiver"]);
        res.json({user: user});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.getUser = async (req, res) => {
    try {
        const input = req.params.id;
        const isEmail = validator.isEmail(input);
        if (isEmail) {
            const user = await firebase.getUserByEmail(input);
            const isExsits = await service.checkUserExists(user.uid);
            if (isExsits) res.json(user.uid);
            else res.status(404).json({message: "user not found."});
        } else {
            const isExsits = await service.checkUserExists(input);
            if (isExsits) res.json(input);
            else res.status(404).json({message: "user not found."});
        }
    } catch (error) {
        res.status(404).json(error);
    }
}

exports.updateProjectStatus = async (req, res) => {
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

exports.getAllProjects = async (req, res) => {
    try {
        const result = await service.getAllProjects();
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getAllProjectByUserID = async (req, res) => {
    try {
        const uid = req.params.id;
        const result = await service.getAllProjectsByUserID(uid);
        const projects = JSON.parse(String(result));
        res.json(projects);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getAllProjectByReceiver = async (req, res) => {
    try {
        const uid = req.params.id;
        const result = await service.getAllProjectsByReceiverID(uid);
        const projects = JSON.parse(String(result));
        res.json(projects);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.query = async (req, res) => {
    const key = req.params.key;

    try {validator
        const result = await service.query(key);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getHistory = async (req, res) => {
    const key = req.params.key;

    try {
        const result = await service.getHistory(key);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getDonationHistory = async (req, res) => {
    const key = req.params.key;

    try {
        const result = await service.getDonationHistory(key);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getTx = async (req, res) => {
    const id = req.params.txid;
    try {
        const result = await service.queryTx(id);
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}
