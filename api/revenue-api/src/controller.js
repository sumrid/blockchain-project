let invoice = [{number:001, total:400},{number:002, total:500}]

async function getINV(req, res) {
    const number = req.params.number;
    if (number === "200") res.json({ status: 200, number: req.params.number, total: 500 });
    else res.status(404).end();
}

async function addINV(req, res) {
    const number = req.params.number;
    if (number === "200") res.json({ status: 200, id: req.params.number });
    else res.status(404).end();
}

module.exports = {
    addINV,
    getINV
}