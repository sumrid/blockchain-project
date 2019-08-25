// const firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/firestore');

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// Init firebase
require('./config');
const admin = require('firebase-admin');
const db = admin.firestore();
const auth = admin.auth();

async function getProfile(email, password) {
    try {
        const user = await auth.getUserByEmail(email);
        return user;
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} name 
 */
async function regisUser(email, password, name) {
    try {
        const user = await auth.createUser({
            email: email,
            password: password,
            displayName: name
        });
        return user;
    } catch (err) {
        throw err;
    }
}

/**
 * setUserRole สร้างข้อมูลผู้ใช้เก็บลง firestore
 * @param {string} uid 
 * @param {string[]} role 
 */
async function setUserRole(uid, role) {
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

/**
 * updateUserRole
 * @param {string} uid 
 * @param {string[]} role 
 */
async function updateUserRole(uid, role) {
    try {
        await db.collection('users').doc(uid).update({ role: role });
    } catch (err) {
        throw err;
    }
}

module.exports = {
    regisUser,
    setUserRole,
    updateUserRole,
    getProfile
}