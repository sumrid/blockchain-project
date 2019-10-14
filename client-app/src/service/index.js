import axios from 'axios';
import { API_IP , PROTOCOL} from '../util';
import { firestore } from 'firebase';

const DONATOR_API = `${PROTOCOL}//${API_IP}:8000`;
const CREATOR_API = `${PROTOCOL}//${API_IP}:8001`;
const RECEIVER_API = `${PROTOCOL}//${API_IP}:8002`;

const REVENUE_API = `${PROTOCOL}//${API_IP}:8080`;

// ###################
//       Project
// ###################
/**
 * **Create project**
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

// #################
// #      User
// #################
async function getUserByID(uid) {
    try {
        const res = await axios.get(`${DONATOR_API}/api/user/${uid}`);
        return res.data;
    } catch (error) {
        throw error;
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

async function checkUserExists(user) {
    const res = await axios.get(RECEIVER_API + `/api/user/${user}`);
    return res.data;
}

async function updateUser(uid, data) {
    try {
        await axios.put(CREATOR_API + `/api/user/${uid}`, data);
    } catch (error) {
        throw error;
    }
}

async function getCreatorRating(uid) {
    try {
        const res = await axios.get(DONATOR_API + `/api/user/${uid}/rating`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

async function sendRating(creator, rater, rate) {
    await axios.post(DONATOR_API + `/api/user/${creator}/rating`, {rater, rate});
}

async function isRate(creator, rater) {
    const res = await axios.get();
    return res.data;
}

/**
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
        const res = await axios.get(`${DONATOR_API}/api/project/${projectID}/donations`);
        return res.data;
    } catch (err) {
        throw err;
    }
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

async function getInvoice(uid) {
    try {
        const res = await axios.get(`${DONATOR_API}/api/project/${uid}/invoice`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

/**
 * sendInvoice
 * @param {string} user 
 * @param {string} project 
 * @param {*} invoice 
 */
async function sendInvoice(user, project, invoice) {
    try {
        const req = {
            user: user,
            project: project,
            invoice: invoice
        }
        const res = await axios.post(`${CREATOR_API}/api/invoice`, req);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getTx(txid) {
    try {
        const res = await axios.get(`${CREATOR_API}/api/tx/${txid}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

// #############################
//     Revenue Departments
// #############################
async function getInvoiceByID(id) {
    try {
        const res = await axios.get(`${REVENUE_API}/api/invoice/${id}`);
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
        console.info(`[service] [getProjectInfo] ${uid}`);
        const doc = await firestore().collection('projects').doc(uid).get();
        return doc.data();
    } catch (err) {
        throw err;
    }
}

async function getProjectsInfo() {
    try {
        console.info(`[service] [getProjectsInfo] get all project`);
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
    getTx,
    donate,
    isRate,
    getEvents,
    sendRating,
    updateUser,
    getInvoice,
    getUserInfo,
    getProjects,
    sendInvoice,
    getUserByID,
    getMyProject,
    getMyReceive,
    createProject,
    updateProject,
    getProjectByID,
    getProjectInfo,
    getInvoiceByID,
    checkUserExists,
    getProjectsInfo,
    getCreatorRating,
    getDonationHistory,
    updateProjectStatus,
    getDonationByUserID,
}