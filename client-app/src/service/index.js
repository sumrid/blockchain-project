import axios from 'axios';
import { API_IP } from '../util';
const baseUrl = `http://${API_IP}:8000`;

async function createProject(project) {
    try {
        const res = await axios.post(baseUrl + '/api/project', project);
        return res.data;
    } catch (err) {
        throw err;
    }
}
async function getProjects() {
    try {
        const res = await axios.get(baseUrl + '/api/project');
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
        const res = await axios.post(baseUrl + '/api/project/donate', donation);
        return res.data;
    } catch (err) {
        throw err;
    }
}

async function getDonationHistory(projectID) {
    try {
        const res = await axios.get(baseUrl + '/api/project/donations/' + projectID);
        return res.data;
    } catch (err) {
        throw err;
    }
}

export default {
    createProject,
    getProjects,
    donate,
    getDonationHistory
}