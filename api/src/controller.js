const service = require('./service');
const firebase = require('./service.firebase');
const moment = require('moment');
const uid = require('uuid/v4');

const generatePayload = require('promptpay-qr')
const qrcode = require('qrcode')
const fs = require('fs');
const path = require('path');

const DATETIME_LAYOUT = 'DD-MM-YYYY:HH:mm:ss';

/**
    createProject สำหรับการสร้างโปรเจค

    @async
    @function createProject
*/
exports.createProject = async (req, res) => {
    const project = req.body;

    // Generate key for project
    // และกำหนดค่าเริ่มต้น
    project.id = 'p_' + uid();
    project.starttime = moment().format(DATETIME_LAYOUT);
    // project.endtime = '11-08-2019:12:00:00';

    try {
        // บันทึกข้อมูลลงทั้ง blockchain and firebase
        const result = await service.createProject(project);
        await firebase.saveProject(project);
        res.status(201).json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}

/* 
    donate ทำการบริจาคเงินไปยังโครงการ
*/
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
    const payload = generatePayload(mobileNumber, { amount }); // First parameter : mobileNumber || IDCardNumber
    console.log(payload);

    const options = { type: "svg", color: { dark: "#705f5f", light: "#fff" } };
    qrcode.toString(payload, options, (err, svg) => {
        if (err) return console.log(err);
        fs.writeFileSync("./src/qr.svg", svg);

        const p = path.join(__dirname, 'qr.svg');
        res.sendFile(p);
    });

}

/**
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

const schedlue = require('node-schedule');

/**
 * Check if the time has expired.  
 * เป็นฟังก์ชันที่จะทำงานทุกเที่ยงของทุกวัน
 * @private
 */
let job = schedlue.scheduleJob('0 12 * * *', async () => {
    results = await firebase.getProject();
    results.forEach(doc => {
        const project = doc.data();
        const now = moment().utc(true);                         // To local time
        const end = moment(project.endtime.toDate()).utc(true); // To local time
        const diff = end.diff(now);
        console.log(end.diff(now));
        if (diff <= 0) { // TODO เพิ่มเงื่อนไข ถ้าโปรเจคปิดไปแล้ว
            try {
                service.closeProject(project.id);
            } catch (err) {
                console.error(err);
            }
        }
    });
});

// Interval 5sec
// let testJob = schedlue.scheduleJob('*/5 * * * * *', async () => {
//     results = await firebase.getProject();

//     results.forEach(doc => {
//         const project = doc.data();
//         const now = moment().utc(true);                         // To local time
//         const end = moment(project.endtime.toDate()).utc(true); // To local time
//         const diff = end.diff(now);
//         console.log(end.diff(now) + 'id '+ project.id);
//         if (diff <= 0) {
//             try {
//                 service.closeProject(project.id);
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//     });
// });

// TODO deploy api to cloud