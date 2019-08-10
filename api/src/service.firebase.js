const admin = require('firebase-admin');
const db = admin.firestore();
const collection = db.collection('projects');

const moment = require('moment');
const DATETIME_LAYOUT = 'DD-MM-YYYY:HH:mm:ss';

exports.saveProject = async (project) => {
    console.log('[save project to firebase]');

    // เปลี่ยน string เป็น datetime
    const endtime = moment(project.endtime, DATETIME_LAYOUT).toDate();
    project.starttime = moment().toDate();
    project.endtime = endtime;

    try {
        await collection.doc(project.id).set(project);
        return;
    } catch (err) {
        throw err;
    }
}

exports.getProject = async () => {
    snapshot = await collection.get();
    return snapshot;
}

exports.getProjectByID = async (key) => {
    try {
        const result = await collection.doc(key).get();
        return result.data();
    } catch (err) {
        throw err;
    }
}