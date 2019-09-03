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

/**
    createProject สำหรับการสร้างโปรเจค
    @async
    @function createProject
*/
exports.createProject = async (req, res) => {
    try {
        const user = req.body.owner; // จำเป็นต้องใช้ในการสร้างโครงการ
        const project = req.body;

        // Generate key for project
        // และกำหนดค่าเริ่มต้น
        project.id = 'p_' + uid();
        project.balance = 0;
        project.status = 'pending';
        project.starttime = moment().format(DATETIME_LAYOUT);
        // project.endtime = '11-08-2019:12:00:00';

        // บันทึกข้อมูลลงทั้ง blockchain and firebase
        const result = await service.createProject(user, project);
        await firebase.saveProject(project);
        res.status(201).json(JSON.parse(String(result)));
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.updateProject = async (req, res) => {
    try {
        const userID = req.body.owner;
        const project = req.body;
        
        const result = await service.updateProject(userID, project);
        const updateDB = await firebase.updateProject(project);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
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

/**
 * donate ทำการบริจาคเงินไปยังโครงการ
 */
exports.donate = async (req, res) => {
    const user = req.body.user;
    const donation = req.body;
    donation.time = moment().format(DATETIME_LAYOUT);

    try {
        await service.donate(user, donation);
        res.json("Success.");
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

// ##############################
// #   check time has expired.
// ##############################
const schedlue = require('node-schedule');
/**
 * Check if the time has expired.  
 * เป็นฟังก์ชันที่จะทำงานทุกเที่ยงของทุกวัน
 * @private
 */
// let job = schedlue.scheduleJob('0 12 * * *', async () => {
//     results = await firebase.getProject();
//     results.forEach(doc => {
//         const project = doc.data();
//         const now = moment().utc(true);                         // To local time
//         const end = moment(project.endtime.toDate()).utc(true); // To local time
//         const diff = end.diff(now);
//         console.log(end.diff(now));
//         if (diff <= 0) {
//             try {
//                 service.closeProject(project.id);
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//     });
// });

// Interval
// [test]
schedlue.scheduleJob('*/20 * * * * *', async () => {
    const results = await service.getAllProjects();
    const projects = JSON.parse(String(results));
    projects.forEach((p) => {
        if (p.status != 'closed') {
            const endtime = moment(p.endtime, moment.ISO_8601);
            console.log(endtime.toISOString() + ' ' + endtime.fromNow());
            if (endtime.diff(moment()) <= 0) {
                console.log(endtime.diff(moment()));
                service.closeProject(p.id); // ทำการปิดโปรเจค
            }
        }
    });
});
