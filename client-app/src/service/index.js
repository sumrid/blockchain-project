import axios from 'axios';
import { API_IP } from '../util';
import { firestore } from 'firebase';
import { EROFS } from 'constants';

// const SERVICE_URL = `http://${API_IP}:8000`;
// const USER_SERVICE = `http://${API_IP}:8001`;
const DONATOR_API = `http://${API_IP}:8000`;
const CREATOR_API = `http://${API_IP}:8001`;
const RECEIVER_API = `http://${API_IP}:8002`;

/**
 * Create project
 * @param {*} project 
 */
async function createProject(project) {
    try {
        const res = await axios.post(CREATOR_API + '/api/project', project);
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function updateProject(project) {
    const res = await axios.put(DONATOR_API + '/api/project', project);
    return res.data;
}

async function updateProjectStatus(user, project, status) {
    const body = {
        user: user,
        project: project,
        status: status
    }
    const res = await axios.post(RECEIVER_API + '/api/project/update/status', body);
    return res.data;
}

/**
 * ดึงรายการโครงการทั้งหมดที่มีจาก chaincode
 */
async function getProjects() {
    try {
        const res = await axios.get(DONATOR_API + '/api/project');
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
        const res = await axios.get(DONATOR_API + '/api/query/' + id);
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function getMyProject(uid) {
    try {
        const res = await axios.get(CREATOR_API + '/api/user/' + uid + '/project');
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function getMyReceive(uid) {
    try {
        const res = await axios.get(RECEIVER_API + '/api/user/' + uid + '/receive');
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
        const res = await axios.post(DONATOR_API + '/api/project/donate', donation);
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
        const res = await axios.get(DONATOR_API + '/api/project/donations/' + projectID);
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function checkUserExists(user) {
    const res = await axios.get(RECEIVER_API + `/api/user/${user}`);
    return res.data;
}

/**
 * ดึงรายการการบริจาคของผู้ใช้คนนั้น
 * @param {stirng} uid
 */
async function getDonationByUserID(uid) {
    try {
        const res = await axios.get(`${DONATOR_API}/api/user/${uid}/donation`);
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function getEvents(uid) {
    try {
        const res = await axios.get(`${DONATOR_API}/api/project/${uid}/events`);
        return res.data;
    } catch (error) {
        throw error;
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

/**
 * getProjectInfo ทำการดึงข้อมูลของโครงการจาก firebase
 * @param {string} uid 
 */
async function getProjectInfo(uid) {
    try {
        const doc = await firestore().collection('projects').doc(uid).get();
        return doc.data();
    } catch (err) {
        throw err;
    }
}

async function getProjectsInfo() {
    try {
        const res = await firestore().collection('projects').get();
        let project = [];
        res.forEach((sp)=> {
            project.push(sp.data());
        });
        return project;
    } catch (error) {
        throw error;
    }
}


export default {
    donate,
    getEvents,
    getUserInfo,
    getProjects,
    getMyProject,
    getMyReceive,
    createProject,
    updateProject,
    getProjectByID,
    getProjectInfo,
    checkUserExists,
    getProjectsInfo,
    getDonationHistory,
    updateProjectStatus,
    getDonationByUserID,
}