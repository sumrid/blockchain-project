// Init firebase
require('../src/config/firebase');
console.log('connect to firebase');

const admin = require('firebase-admin');
const db = admin.firestore();
const ProjectCollection = db.collection('projects');

const moment = require('moment');
const DATETIME_LAYOUT = 'DD-MM-YYYY:HH:mm:ss';

/**
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */
exports.registerUser = async (name, email, password) => {
    try {
        const user = await admin.auth().createUser({
            displayName: name,
            email: email,
            password: password
        });
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * setUserRole สร้างข้อมูลผู้ใช้เก็บลง firestore
 * @param {string} uid 
 * @param {string[]} role 
 */
exports.setUser = async (uid, role) => {
    const data = {
        uid: uid,
        role: role
    }
    try {
        await db.collection('users').doc(uid).set(data);
    } catch (err) {
        throw err;
    }
}

exports.getUserByEmail = async (email) => {
    try {
        const user = await admin.auth().getUserByEmail(email);
        return user;
    } catch (error) {
        throw error;
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
