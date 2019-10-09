import {API_URL} from '../constants';
import axios from 'axios';

/**
 * 
 * @param {string} checker uid ของผู้ที่ทำการตรวจสอบ
 * @param {string} user uid ของผู้ใช้
 * @param {number} verify 
 */
async function approveIDCard(checker, user, verify) {
    const req = {
        checker,
        verify
    }
    const res = await axios.put(`${API_URL}/api/user/${user}/verify/idcard`, req);
    return res.data;
}

export default {
    approveIDCard
}