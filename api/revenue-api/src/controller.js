require('./firebase/config');
const admin = require('firebase-admin');
const invoiceRef = admin.firestore().collection('invoices');

async function getINV(req, res) {
    try {
        const id = req.params.id;
        const doc = await invoiceRef.doc(id).get();
        if (doc.exists) res.json(doc.data());
        else res.status(404).end();
    } catch (error) {
        res.status(404).json(error);
    }
}

async function addINV(req, res) {
    try {
        let invoice = req.body;
        invoice.id.toString();
        await invoiceRef.doc(invoice.id).set(invoice);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports = {
    addINV,
    getINV
}