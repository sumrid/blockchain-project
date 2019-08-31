import axios from 'axios';
import { API_IP } from '../util';
import { firestore } from 'firebase';

const SERVICE_URL = `http://${API_IP}:8000`;
const USER_SERVICE = `http://${API_IP}:8001`;

/**
 * Create project
 * @param {*} project 
 */
async function createProject(project) {
    try {
        const res = await axios.post(SERVICE_URL + '/api/project', project);
        return res.data;
    } catch (err) {
        throw err;
    }
}
/**
 * ดึงรายการโครงการทั้งหมดที่มีจาก chaincode
 */
async function getProjects() {
    try {
        const res = await axios.get(SERVICE_URL + '/api/project');
        return res.data;
    } catch (err) {
        throw err;
    }
}

/**
 * Get project by uid
 * @param {string} id 
 */
async function getProjectByID(id) {
    try {
        const res = await axios.get(SERVICE_URL + '/api/query/' + id);
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function getMyProject(uid) {
    try {
        const res = await axios.get(SERVICE_URL + '/api/user/' + uid + '/project');
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function getMyReceive(uid) {
    try {
        const res = await axios.get(SERVICE_URL + '/api/user/' + uid + '/receive');
        return res.data;
    } catch (err) {
        throw err;
    }
}

/**
 * @function
 * donate ทำการบริจาคไปยังโครงการที่ต้องการ
 * 
 * @param {*} donation
 */
async function donate(donation) {
    try {
        const res = await axios.post(SERVICE_URL + '/api/project/donate', donation);
        return res.data;
    } catch (err) {
        throw err;
    }
}

/**
 * ดึงประวัติการบริจาคของแต่ละโครงการ
 * @param {string} projectID 
 */
async function getDonationHistory(projectID) {
    try {
        const res = await axios.get(SERVICE_URL + '/api/project/donations/' + projectID);
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function checkUserExists(user) {
    const res = await axios.get(USER_SERVICE + `/api/user/${user}/isexists`);
    return res.data;
}

/**
 * ดึงรายการการบริจาคของผู้ใช้คนนั้น
 * @param {stirng} uid
 */
async function getDonationByUserID(uid) {
    try {
        const res = await axios.get(`${SERVICE_URL}/api/user/${uid}/donation`);
        return res.data;
    } catch (err) {
        throw err;
    }
}

// #############################
//      firebase firestore
// #############################
/**
 * ดึงข้อมูลของผู้ใช้จาก firebase
 * @param {string} uid 
 */
async function getUserInfo(uid) {
    try {
        const doc = await firestore().collection('users').doc(uid).get();
        return doc.data();
    } catch (err) {
        throw err;
    }
}

async function getProjectInfo(uid) {
    try {
        const doc = await firestore().collection('projects').doc(uid).get();
        return doc.data();
    } catch (err) {
        throw err;
    }
}


export default {
    createProject,
    getProjects,
    getProjectByID,
    getMyProject,
    getMyReceive,
    donate,
    getDonationHistory,
    getUserInfo,
    getDonationByUserID,
    getProjectInfo,
    checkUserExists
}