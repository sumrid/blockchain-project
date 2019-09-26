const fs = require('fs');
const path = require('path');
const uid = require('uuid/v4');
const qrcode = require('qrcode');
const moment = require('moment');
const buildUrl = require('build-url');
const service = require('../service/service');
const firebase = require('../service/firebase');
const generatePayload = require('promptpay-qr');

async function donate(req, res) {
    try {
        const user = req.body.user;
        const donation = req.body;
        donation.time = moment().format(DATETIME_LAYOUT);
        await service.donate(user, donation);
        res.json("Success.");
    } catch (err) {
        res.status(500).json(err);
    }
}

async function createQR(req, res) {
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

async function readQR(req, res) {
    try {
        const donation = req.body;
        await firebase.deleteQR(donation.id);
        res.json(donation);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function createQRv3(req, res) {
    const ip = process.env.HOST_IP;
    const donation = req.body;
    donation.id = uid();

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

module.exports = {
    donate,
    readQR,
    createQR,
    createQRv3
}