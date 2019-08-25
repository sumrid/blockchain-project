import axios from 'axios';
import { API_IP } from '../util';
import { firestore } from 'firebase';

const SERVICE_URL = `http://${API_IP}:8000`;

async function createProject(project) {
    try {
        const res = await axios.post(SERVICE_URL + '/api/project', project);
        return res.data;
    } catch (err) {
        throw err;
    }
}
/**
 * ดึงรายการโครงการทั้งหมดที่มี
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
 * @function
 * donate ทำการบริจาคไปยังโครงการที่ต้องการ
 * 
 * @param donation
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
 * @param {*} projectID 
 */
async function getDonationHistory(projectID) {
    try {
        const res = await axios.get(SERVICE_URL + '/api/project/donations/' + projectID);
        return res.data;
    } catch (err) {
        throw err;
    }
}

/**
 * ดึงข้อมูลของผู้ใช้จาก firebase
 * @param {string} uid 
 */
async function getUserInfo(uid) {
    const doc = await firestore().collection('users').doc(uid).get();
    return doc.data;
}

export default {
    createProject,
    getProjects,
    donate,
    getDonationHistory,
    getUserInfo
}