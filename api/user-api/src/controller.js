const service = require('./service');
const firebase = require('./firebase');

/**
 * **ลงทะเบียนผู้บริจาคใน firebase และใน CA**  
 * มีการรับค่าจาก request คือ  
 * - `name` ชื่อที่จะใช้แสดง  
 * - `email` email ของผู้ใช้  
 * - `password` email ของผู้ใช้
 */
exports.registerDonator = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = ['donator'];
    try {
        const user = await firebase.regisUser(email, password, name); // ลงทะเบียนบน firebase
        const setRole = firebase.setUserRole(user.uid, role);
        const regisCA = service.registerDonator(user.uid); // ทำการลงทะเบียนกับ CA
        await Promise.all([setRole, regisCA]);
        res.status(201).json({ uid: user.uid });
    } catch (err) {
        res.status(500).json(err);
    }
}

/**
 * **ลงทะเบียนผู้สร้างโครงการใน firebase และใน CA**  
 * มีการรับค่าจาก request คือ  
 * - `name` ชื่อที่จะใช้แสดง  
 * - `email` email ของผู้ใช้  
 * - `password` email ของผู้ใช้
 */
exports.registerCreator = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = ['donator', 'creator'];
    try {
        const user = await firebase.regisUser(email, password, name);
        const setRole = firebase.setUserRole(user.uid, role);
        const regisCA = service.registerCreator(user.uid);
        await Promise.all([regisCA, setRole]);
        res.status(201).json({ uid: user.uid, role: role });
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.promoteToCreator = async (req, res) => {
    const uid = req.body.uid;
    const email = req.body.email;
    const role = ['donator', 'creator'];
    try {
        // const regisCA = service.registerCreator(email);
        // const setRole = firebase.updateUserRole(uid, role);
        // await Promise.all([regisCA, setRole]);

        await firebase.updateUserRole(uid, role);

        res.json({ message: 'success.' });
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getProfile = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await firebase.getProfile(email, password);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    // res.status(401).json({ token: token });
    next();
}