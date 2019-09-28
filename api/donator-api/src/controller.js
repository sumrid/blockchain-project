const service = require('./service');
const firebase = require('./service.firebase');
const moment = require('moment');
const uid = require('uuid/v4');
const buildUrl = require('build-url');

const generatePayload = require('promptpay-qr')
const qrcode = require('qrcode')
const fs = require('fs');
const path = require('path');

const DATETIME_LAYOUT = 'DD-MM-YYYY:HH:mm:ss';


exports.registerDonator = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const user = await firebase.registerUser(name, email, password);
        await service.register(user.uid);
        await firebase.setUser(user.uid, name, ["donator"]);
        res.json({ user: user });
    } catch (error) {
        res.status(500).json(error);
    }
}

/**
 * donate ทำการบริจาคเงินไปยังโครงการ
 */
exports.donate = async (req, res) => {
    const user = req.body.user;
    const donation = req.body;
    donation.time = moment().toDate().toISOString();

    try {
        const result = await service.donate(user, donation);
        const payload = JSON.parse(String(result));
        res.json(payload);
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

    try {
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

exports.getEvent = async (req, res) => {
    try {
        const project = req.params.project;
        const result = await service.getEvent(project);
        const events = JSON.parse(String(result));
        res.json(events);
    } catch (error) {
        res.status(404).json(error);
    }
}

/**
 * getInvoice
 */
exports.getInvoice = async (req, res) => {
    try {
        const project = req.params.project;
        const result = await service.getProjectInvoice(project);
        const invoices = JSON.parse(String(result));
        res.json(invoices);
    } catch (error) {
        res.status(500).json(error);
    }
}

/**
 * @function
 * createQR สำหรับการสร้างพร้อมเพย์ qr code  
 */
exports.createQR = async (req, res) => {
    const mobileNumber = "086-312-6030";
    const IDCardNumber = "0-0000-00000-00-0";
    const amount = req.body.amount;
    const payload = generatePayload(mobileNumber, { amount }); // First parameter : mobileNumber || IDCardNumber
    console.log('qr payload: ' + payload);

    const options = { type: "svg", color: { dark: "#705f5f", light: "#fff" } };
    qrcode.toString(payload, options, (err, svg) => {
        if (err) return console.log(err);
        fs.writeFileSync("./src/qr.svg", svg);

        const p = path.join(__dirname, 'qr.svg');
        res.sendFile(p);
    });
}

/**
 * createQR v2
 */
exports.createQrDonation = async (req, res) => {
    const donation = req.body;
    donation.id = uid();
    // Save to DB
    try {
        await firebase.saveQR(donation);
    } catch (err) {
        res.status(500).json(err);
    }
    // Generate QR
    const options = { type: "svg", color: { dark: "#705f5f", light: "#fff" } };
    qrcode.toString(JSON.stringify(donation), options, (err, svg) => {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        }
        // ส่งไฟล์ qr กลับไป
        const qrPath = path.join(__dirname, 'qr.svg');
        fs.writeFileSync(qrPath, svg);
        res.sendFile(qrPath);
    });
}
/**
 * createQR v3  
 * สร้าง qr โดยใช้ url 
 * เมื่อแสกนแล้วให้เปิดหน้าเว็บ
 */
exports.createQRv3 = async (req, res) => {
    const ip = process.env.HOST_IP || require('ip').address();
    const donation = req.body;
    donation.id = uid();
    // Save to DB
    // try {
    //     await firebase.saveQR(donation);
    // } catch (err) {
    //     res.status(500).json(err);
    // }

    const url = `http://${ip}/#/confirm`
    const payload = buildUrl(url, {
        queryParams: donation
    });

    // Generate QR
    const options = { type: "svg", color: { dark: "#705f5f", light: "#fff" } };
    qrcode.toString(payload, options, (err, svg) => {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        }
        // ส่งไฟล์ qr กลับไป
        const qrPath = path.join(__dirname, 'qr.svg');
        fs.writeFileSync(qrPath, svg);
        res.sendFile(qrPath);
    });
}

/**
 * ใช้คู่กับ createQR v2
 */
exports.readQR = async (req, res) => {
    const donation = req.body;
    console.log(donation);
    try {
        // แล้วค่อยลบออก
        await firebase.deleteQR(donation.id);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.getDonationByUserID = async (req, res) => {
    const userid = req.params.id;
    try {
        const result = await service.getDonationByUserID(userid);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}

/**
 * @function
 * This function test to use firebasefirestore
 */
exports.testSave = async (req, res) => {
    const project = req.body;

    // Generate key for project
    project.id = 'p_' + uid();

    try {
        await firebase.saveProject(project);
        res.json(project);
    } catch (err) {
        res.status(500);
    }
}
exports.testGet = async (req, res) => {
    const key = req.body.id;
    try {
        const result = await firebase.getProjectByID(key);
        const time = moment(result.endtime.toDate()).utc(true);   // .utc(true) จะทำให้เป็นเวลา local (thai utc + 7)
        res.json(time);
    } catch (err) {
        res.status(404).json(err);
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
