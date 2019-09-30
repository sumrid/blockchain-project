const service = require('../service/service');

exports.query = async (req, res) => {
    const key = req.params.key;

    try {
        const result = await service.query(key);
        res.json(JSON.parse(String(result)));
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getTx = async (req, res) => {
    const id = req.params.txid;
    try {
        const result = await service.queryTx(id);
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

// ##############################
// #   check time has expired.
// ##############################
// const schedlue = require('node-schedule');
/**
 * Check if the time has expired.  
 * เป็นฟังก์ชันที่จะทำงานทุกเที่ยงของทุกวัน
 * @private
 */
// let job = schedlue.scheduleJob('0 12 * * *', async () => {
//     results = await firebase.getProject();
//     results.forEach(doc => {
//         const project = doc.data();
//         const now = moment().utc(true);                         // To local time
//         const end = moment(project.endtime.toDate()).utc(true); // To local time
//         const diff = end.diff(now);
//         console.log(end.diff(now));
//         if (diff <= 0) {
//             try {
//                 service.closeProject(project.id);
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//     });
// });