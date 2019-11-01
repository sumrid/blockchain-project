// Init firebase
require('../config/firebase');
console.log('connect to firebase');

const admin = require('firebase-admin');
const db = admin.firestore();
const ProjectCollection = db.collection('projects');
const QRCollection = db.collection('qr');

const moment = require('moment');
const nodemailer = require('nodemailer');

// ####################
// #     Project
// ####################
async function saveProject(project) {
    console.log('[firebase] [saveProject] [save project to firebase]');
    try {
        // เปลี่ยน string เป็น datetime
        const endtime = moment(project.endtime).toDate();
        project.starttime = moment().toDate();
        project.endtime = endtime;

        // TODO ลบส่วนที่จะไม่เก็บ
        delete project.balance;
        delete project.file;

        await ProjectCollection.doc(project.id).set(project);
    } catch (err) {
        throw err;
    }
}

async function updateProject(project) {
    try {
        const result = await ProjectCollection.doc(project.id).update(project);
        return result;
    } catch (err) {
        throw err;
    }
}

async function deleteProject(uid) {
    await ProjectCollection.doc(uid).delete();
}

async function getProject() {
    const snapshot = await ProjectCollection.get();
    return snapshot;
}

async function getProjectByID(key) {
    try {
        const result = await ProjectCollection.doc(key).get();
        return result.data();
    } catch (err) {
        throw err;
    }
}

// ###############
// #     User
// ###############
/**
 * ลงทะเบียนผู้ใช้
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */
async function registerUser(name, email, password) {
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

async function getUserData(uid) {
    const user = await db.collection('users').doc(uid).get();
    return user.data();
}

async function setUser(uid, name, role) {
    try {
        const data = {
            uid: uid,
            name: name,
            role: role,
            verify: 0,
            avg_rating: 0,
            num_rating: 0
        }
        await db.collection('users').doc(uid).set(data);
    } catch (error) {
        throw error;
    }
}

async function updateUser(uid, data) {
    try {
        await db.collection('users').doc(uid).update(data);
    } catch (error) {
        throw error;
    }
}

async function deleteUser(uid) {
    try {
        await admin.auth().deleteUser(uid);             // auth
        await db.collection('users').doc(uid).delete(); // DB
    } catch (error) {
        throw error;
    }
}

async function getUserByEmail(email) {
    try {
        const user = await admin.auth().getUserByEmail(email);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserByUID(uid) {
    try {
        const user = await admin.auth().getUser(uid);
        return user;
    } catch (error) {
        throw error;
    }
}

async function sendConfirmEmail(email) {
    try {
        const link = await admin.auth().generateEmailVerificationLink(email);
        console.log(`[firebase] [sendConfirmEmail] link: ${link}`);
        await sendEmail(email, link);
    } catch (error) {
        throw error;
    }
}

async function sendEmail(email, link) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'donate.chain@gmail.com',
            pass: process.env.GMAIL_PASS || '81555084',
        },
    });
    try {
        const info = await transporter.sendMail({
            from: 'donate.chain@gmail.com',
            to: email,
            subject: 'Donate-web [ยืนยัน Email]',
            html: `<a href="${link}">กดเพิ่อยืนยัน Email</a>`
        });
        console.info(info);
    } catch (error) {
        throw error;
    }
}

async function addRating(rater, creator, rate) {
    await db.collection('rating').doc(`${creator}_${rater}`).set({rater, creator, rate});
}

async function getRating(creator, rater) {
    const res = await db.collection('rating').doc(`${creator}_${rater}`).get();
    return res.data();
}

async function getRatingByCreator(uid) {
    const res = await db.collection('rating').where('creator', '==', uid).get();
    const ratings = [];
    res.forEach(doc => {
        ratings.push(doc.data());
    });
    return ratings;
}

// ####################
// #      QR code
// ####################
/**
 * สำหรับเก็บข้อมูล qrcode ที่สร้างขึ้นมา
 */
async function saveQR(donation) {
    try {
        await QRCollection.doc(donation.id).set(donation);
    } catch (err) {
        throw err;
    }
}

async function deleteQR(id) {
    try {
        await QRCollection.doc(id).delete();
    } catch (err) {
        throw err;
    }
}


module.exports = {
    saveProject,
    updateProject,
    getProject,
    getProjectByID,
    deleteProject,
    registerUser,
    updateUser,
    setUser,
    getUserData,
    getUserByUID,
    getUserByEmail,
    sendConfirmEmail,
    deleteUser,
    saveQR,
    deleteQR,
    addRating,
    getRating,
    getRatingByCreator
}