// Init firebase
require('../src/config/firebase');
console.log('connect to firebase');

const admin = require('firebase-admin');
const db = admin.firestore();
const ProjectCollection = db.collection('projects');
const QRCollection = db.collection('qr');

const moment = require('moment');
const DATETIME_LAYOUT = 'DD-MM-YYYY:HH:mm:ss';

exports.saveProject = async (project) => {
    console.log('[save project to firebase]');

    // เปลี่ยน string เป็น datetime
    const endtime = moment(project.endtime, DATETIME_LAYOUT).toDate();
    project.starttime = moment().toDate();
    project.endtime = endtime;
    
    // TODO ลบส่วนที่จะไม่เก็บ
    delete project.balance;
    delete project.file;

    try {
        await ProjectCollection.doc(project.id).set(project);
    } catch (err) {
        throw err;
    }
}

exports.updateProject = async (project) => {
    try {
        const result = await ProjectCollection.doc(project.id).update(project);
        return result;
    } catch (err) {
        throw err;
    }
}

exports.getProject = async () => {
    snapshot = await ProjectCollection.get();
    return snapshot;
}

exports.getProjectByID = async (key) => {
    try {
        const result = await ProjectCollection.doc(key).get();
        return result.data();
    } catch (err) {
        throw err;
    }
}

/**
 * สำหรับเก็บข้อมูล qrcode ที่สร้างขึ้นมา
 */
exports.saveQR = async (donation) => {
    try {
        await QRCollection.doc(donation.id).set(donation);
    } catch (err) {
        throw err;
    }
}
exports.deleteQR = async (id) => {
    try {
        await QRCollection.doc(id).delete();
    } catch (err) {
        throw err;
    }
}
