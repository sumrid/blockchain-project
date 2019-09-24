const service = require('../service/service');

async function donate(req, res) {
    try {
        const user = req.body.user;
        const donation = req.body;
        donation.time = moment().format(DATETIME_LAYOUT);
        await service.donate(user, donation);
        res.json("Success.");
    } catch (err) {
        res.status(500).json(err);
    }
}

async function createQR(req, res) {

}

async function readQR(req, res) {

}

async function createQRv3(req, res) {

}

module.exports = {
    donate,
    readQR,
    createQR,
    createQRv3
}