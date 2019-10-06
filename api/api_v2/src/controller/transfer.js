const service = require('../service/service');

async function withdrawFromProject(req, res) {
    try {
        const user = req.body.user;
        const project = req.body.project;
        const amount = req.body.amount;

        const result = await service.withdrawFromProject(user, project, amount)
        const payload = JSON.parse(String(result));
        res.json(payload);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function withdrawToBankAccount(req, res) {
    try {
        const user = req.body.user;
        const amount = req.body.amount;
        res.json({user, amount});
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    withdrawFromProject,
    withdrawToBankAccount
}