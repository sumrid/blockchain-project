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
        donation.time = moment().toDate().toISOString();

        const result = await service.donate(user, donation);
        const payload = JSON.parse(String(result));
        res.json(payload);
    } catch (err) {
        res.status(500).json(err);
    }
}

/**
 * ออก QRcode promptpay
 */
async function createQR(req, res) {
    try {
        const mobileNumber = "086-312-6030";
        const IDCardNumber = "0-0000-00000-00-0";
        const amount = req.body.amount;
        const payload = generatePayload(mobileNumber, { amount }); // First parameter : mobileNumber || IDCardNumber
        console.log('[createQR] QR payload: ' + payload);

        const options = { type: "svg", color: { dark: "#705f5f", light: "#fff" } };
        qrcode.toString(payload, options, (err, svg) => {
            if (err) return console.log(err);
            fs.writeFileSync("./src/qr.svg", svg);

            const qr = path.join(__dirname, '..', 'qr.svg');
            res.sendFile(qr);
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

/**
 * createQR v2
 */
async function createQrDonation(req, res) {
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

async function readQR(req, res) {
    try {
        const donation = req.body;
        await firebase.deleteQR(donation.id);
        res.json(donation);
    } catch (err) {
        res.status(500).json(err);
    }
}

/**
 * สร้าง QR เข้าหน้ายืนยันในเว็บ
 * @param {*} req 
 * @param {*} res 
 */
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
    createQRv3,
    createQrDonation
}