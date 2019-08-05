const service = require('./service');

exports.createProject = async (req, res) => {
    const project = req.body;

    try {
        const result = await service.createProject(project);
        res.status(201).json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}

exports.query = async (req, res) => {
    const key = req.params.key;

    try {
        const result = await service.query(key);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}

exports.donate = async (req, res) => {
    const donation = req.body;

    try {
        await service.donate(donation);
        res.json("Success.");
    } catch (err) {
        res.json(err);
    }
}

exports.getHistory = async (req, res) => {
    const key = req.params.key;

    try {
        const result = await service.getHistory(key);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.json(err);
    }
}