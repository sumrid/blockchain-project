import { API_URL } from '../constants';
import Axios from "axios";

async function getProjects() {
    const res = await Axios.get(`${API_URL}/api/project`);
    return res.data;
}

async function getProject(uid) {
    const res = await Axios.get(`${API_URL}/api/project/${uid}`);
    return res.data;
}

async function approveProject(approver, project, status) {
    const res = await Axios.post(`${API_URL}/api/project/${project}/approve`, { approver });
    return res.data;
}

export default {
    getProject,
    getProjects,
    approveProject
}