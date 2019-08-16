const service = require('./service');

/**
 * ลงทะเบียนใน firebase และใน CA
 */
exports.registerDonator = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        await service.registerDonator(name);
        res.status(201).json({message:'success.'});
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