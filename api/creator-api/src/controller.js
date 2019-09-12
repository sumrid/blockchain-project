const service = require('./service');
const firebase = require('./service.firebase');
const moment = require('moment');
const uid = require('uuid/v4');
const buildUrl = require('build-url');
const fs = require('fs');
const path = require('path');

const DATETIME_LAYOUT = 'DD-MM-YYYY:HH:mm:ss';

exports.registerCreator = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const user = await firebase.registerUser(name, email, password);
        await service.registerCreator(user.uid);
        res.json({user:user});
    } catch (error) {
        res.status(500).json(error);
    }
}

/**
 * **createProject สำหรับการสร้างโปรเจค**
 * @async
 * @function createProject
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
        const project = {
            id: req.body.id,
            title: req.body.title,
            detail: req.body.detail
            // TODO อาจจะให้แก้ใขได้มากกว่านี้
        }
        
        const block = service.updateProject(userID, project);
        const db = firebase.updateProject(project);
        const results = await Promise.all([block, db]);
        res.json(results);
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

exports.deleteProject = async (req, res) => {
    try {
        const userID = req.body.user;
        const projectID = req.body.project;

        const result = await service.deleteProject(userID, projectID);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.status(404).json(err);
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
            if (endtime.diff(moment()) <= 0) {
                service.closeProject(p.id); // ทำการปิดโปรเจค
            }
        }
    });
});
