const service = require('../service/service');

async function sendInvoice(req, res) {
    const user = req.body.user;
    const project = req.body.project;
    const invoice = req.body.invoice;
    try {
        let invoiceStr = JSON.stringify(invoice)
        let buffer = await service.addInvoice(user, project, invoiceStr);
        let result = JSON.parse(String(buffer));
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getInvoice(req, res) {
    try {
        const id = req.params.id;
        const result = service.query(id);
        const invoice = JSON.parse(String(result));

        if (invoice) res.json(invoice);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    sendInvoice,
    getInvoice
}