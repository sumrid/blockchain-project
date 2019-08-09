const service = require('./service');
const moment = require('moment');

const generatePayload = require('promptpay-qr')
const qrcode = require('qrcode')
const fs = require('fs');
const path = require('path');

const Project = require('./model/Project')
const DATETIME_LAYOUT = 'DD-MM-YYYY:HH:mm:ss';

/* 
    createProject สำหรับการสร้างโปรเจค
*/
exports.createProject = async (req, res) => {
    const project = req.body;

    try {
        const result = await service.createProject(project);
        res.status(201).json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}

exports.donate = async (req, res) => {
    const donation = req.body;
    donation.time = moment().format(DATETIME_LAYOUT);

    try {
        await service.donate(donation);
        res.json("Success.");
    } catch (err) {
        res.json(err);
    }
}

exports.getAllProjects = async (req, res) => {
    try {
        const result = await service.getAllProjects();
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}

exports.query = async (req, res) => {
    const key = req.params.key;

    try {
        const result = await service.query(key);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
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

exports.createQR = async (req, res) => {
    const mobileNumber = "086-312-6030";
    const IDCardNumber = "0-0000-00000-00-0";
    const amount = req.body.amount;
    const payload = generatePayload(mobileNumber, { amount }); //First parameter : mobileNumber || IDCardNumber
    console.log(payload);

    const options = { type: "svg", color: { dark: "#000", light: "#fff" } };
    qrcode.toString(payload, options, (err, svg) => {
        if (err) return console.log(err);
        fs.writeFileSync("./src/qr.svg", svg);

        const p = path.join(__dirname, 'qr.svg');
        res.sendFile(p);
    });

}

/* 
    This function test use firebasefirestore
*/
exports.test = async (req, res) => {
    const uid = require('uuid/v4');
    let project = {};
    project.id = uid();
    project.title = "Hello";

    let asdf = new Project();
    asdf.id

    console.log(asdf);
    // try {
    //     let db = admin.firestore();
    //     await db.collection('test').doc(project.id).set(project);
    //     res.json(project);
    // } catch (err) {
    //     res.status(500);
    // }
}