const service = require('./service');
const firebase = require('./firebase');

/**
 * ลงทะเบียนใน firebase และใน CA
 */
exports.registerDonator = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await firebase.regisUser(email, password, name);
        await service.registerDonator(user.uid);
        res.status(201).json({uid: user.uid});
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.registerCreator = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        await service.registerCreator(name);
        res.status(201).json({message:'success.'});
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