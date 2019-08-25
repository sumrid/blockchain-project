const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// ทำการอ่านไฟล์ connection.json
const ccpFile = process.env.CCP1 || 'connection1.json';
const ccpPath = path.resolve(__dirname, 'connection_profile', ccpFile);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const ccpFile2 = process.env.CCP1 || 'connection2.json';
const ccpPath2 = path.resolve(__dirname, 'connection_profile', ccpFile2);
const ccpJSON2 = fs.readFileSync(ccpPath2, 'utf8');
const ccp2 = JSON.parse(ccpJSON2);

const USER = 'user1'; // ผู้ใช้เริ่มต้น

// Function name in chaincode
const FN_QUERY = 'query';
const FN_DONATE = 'donate';
const FN_GET_HISTORY = 'getHistory';
const FN_CLOSE_PROJECT = 'closeProject';
const FN_CREATE_PROJECT = 'createProject';
const FN_QUERY_PROJECTS = 'queryAllProjects';
const FN_GET_DONATE_HISTORY = 'getDonationHistory';
const FN_GET_DONATION_BY_USERID = 'queryDonationByUserID';
const CHANNEL = 'mychannel-1';  // ชื่อ channel
const CONTRACT = 'mychaincode'; // ชื่อ chaincode

// #####################
// #    Service  v2    #
// #####################
/**
 * getContract สำหรับฝั่งผู้บริจาค
 * @param {string} user user uid ที่ลงทะเบียนใน CA เรียบร้อยแล้ว
 */
async function getContractOrg1(user) {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet1');
        const wallet = new FileSystemWallet(walletPath);

        // ตรวจสอบ user ว่ามีอยู่ใน wallet ไหม
        const userExists = await wallet.exists(user);
        if (!userExists) {
            throw new Error(`An identity for the user "${user}" does not exist in the wallet`);
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });
        const network = await gateway.getNetwork(CHANNEL); // get channel
        return network.getContract(CONTRACT); // get smart contract (chaincode)
    } catch (err) {
        throw err;
    }
}

async function getContractOrg2(user) {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet1');
        const wallet = new FileSystemWallet(walletPath);

        // ตรวจสอบ user ว่ามีอยู่ใน wallet ไหม
        const userExists = await wallet.exists(user);
        if (!userExists) {
            throw new Error(`An identity for the user "${user}" does not exist in the wallet`);
        }
        const gateway = new Gateway();
        await gateway.connect(ccp2, { wallet, identity: user, discovery: { enabled: false } });
        const network = await gateway.getNetwork(CHANNEL); // get channel
        return network.getContract(CONTRACT); // get smart contract (chaincode)
    } catch (err) {
        throw err;
    }
}

async function getChannal(user) {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet1');
        const wallet = new FileSystemWallet(walletPath);

        // ตรวจสอบ user ว่ามีอยู่ใน wallet ไหม
        const userExists = await wallet.exists(user);
        if (!userExists) {
            throw new Error(`An identity for the user "${user}" does not exist in the wallet`);
        }
        const gateway = new Gateway();
        await gateway.connect(ccp2, { wallet, identity: user, discovery: { enabled: false } });
        const network = await gateway.getNetwork(CHANNEL); // get channel
        return network.getChannel();
    } catch (err) {
        throw err;
    }
}

// #####################
// #  Query and Invoke
// #####################
exports.query = async (key) => {
    try {
        const contract = await getContractOrg1(USER); // ใช้ผู้ใช้เริ่มต้นก็ได้
        const result = await contract.evaluateTransaction(FN_QUERY, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
/**
 * สร้างโครงการเพื่อรับบริจาคเงิน
 * @param {string} useriD
 * @param {object} project
 */
exports.createProject = async (userID, project) => {
    try {
        const contract = await getContractOrg2(userID); // user ต้องสมัครสมาชิคแล้วเท่านั้น
        const result = await contract.
            submitTransaction(
                FN_CREATE_PROJECT,
                project.id,
                project.title,
                project.status,
                project.balance.toString(),
                project.owner, // uid of owner
                project.starttime,
                project.endtime,
                project.receiver,
                project.goal.toString());

        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.donate = async (userID, donation) => {
    try {
        const contract = await getContractOrg1(userID || USER); // ถ้ายังไม่สมัครจะใช้ id ตั้งต้นหรือ ใช้ anonymous ของ firebase
        await contract.submitTransaction(
            FN_DONATE,
            donation.user, // uid of user
            donation.project,
            donation.amount.toString(),
            donation.time,
            donation.displayname
        )
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.getHistory = async (key) => {
    try {
        const contract = await getContractOrg1(USER); // ใช้ userตั้งต้น
        const result = await contract.evaluateTransaction(FN_GET_HISTORY, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.getDonationHistory = async (key) => {
    try {
        const contract = await getContractOrg1(USER); // ผู้ใช้ตั้งต้น
        const result = await contract.evaluateTransaction(FN_GET_DONATE_HISTORY, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.getAllProjects = async () => {
    try {
        const contract = await getContractOrg1(USER); // ผู้ใช้ตั้งต้น
        const result = await contract.evaluateTransaction(FN_QUERY_PROJECTS);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.closeProject = async (key) => {
    try {
        const contract = await getContractOrg2(USER); // ผู้ใช้ตั้งต้น
        const result = await contract.submitTransaction(FN_CLOSE_PROJECT, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.getDonationByUserID = async (userID) => {
    try {
        const contract = await getContractOrg1(USER);
        const result = await contract.evaluateTransaction(FN_GET_DONATION_BY_USERID, userID);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// ################
//     Test zone
// ################
exports.test = async () => {
    try {
        // Get channel, client
        const gateway = await getGateway(USER);
        const network = await gateway.getNetwork(CHANNEL);
        const channel = network.getChannel();
        const client = gateway.getClient();

        // Create tx request poprosal
        const txID = client.newTransactionID();
        const txID_string = txID.getTransactionID();
        const request = {
            targets: ['peer0.org1.example.com', 'peer0.org2.example.com'],
            chaincodeId: CONTRACT,
            fcn: FN_QUERY,
            args: ['stdID|59070174'],
            chainId: CHANNEL,
            txId: txID
        }

        // Send and recive response
        const results = await channel.sendTransactionProposal(request);

        // ตรวจสอบผลลัพธ์
        var proposalResponses = results[0];
        var proposal = results[1];
        let isProposalGood = false;
        if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
            isProposalGood = true;
            console.log('Transaction proposal was good');
        } else {
            console.error('Transaction proposal was bad');
        }

        // ถ้า proposal ผ่าน
        if (isProposalGood) {
            let promises = [];

            // Get event hub
            // และสร้าง promise event
            let eventHubs = channel.getChannelEventHubsForOrg();
            eventHubs.forEach((eventHub) => {
                console.log(eventHub);
                let eventPromise = new Promise((resolve, reject) => {
                    function whenTimeout() {
                        console.info('Event timeout');
                        eventHub.unregisterTxEvent(txID_string);
                        eventHub.disconnect();
                        reject();
                    }
                    let eventTimeout = setTimeout(whenTimeout, 20000);

                    // รอรับ event
                    // พร้อมกับใส่ callback เพื่อให้รู้ว่าเมื่อได้ event จะทำอะไรต่อ
                    eventHub.registerTxEvent(txID_string, (tx_id, code) => {
                        clearTimeout(eventTimeout);
                        eventHub.unregisterTxEvent(txID_string);

                        console.log('Successfully received the tx event');
                        resolve(tx_id, code);
                    });

                    eventHub.connect();
                });

                promises.push(eventPromise);
            });

            // ส่ง transaction
            const requestTx = {
                txId: txID,
                proposalResponses: proposalResponses,
                proposal: proposal
            }
            const sendPromise = channel.sendTransaction(requestTx);
            promises.push(sendPromise);

            return Promise.all(promises);
        } else {
            return new Error('Transaction proposal was bad ' + results);
        }

        // return txID.getTransactionID();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Query โดยใช้ selector
 * @param { string } queryString ex. {"selector":{"id":{"$regex":"p_"}}}
 */
exports.query2 = async (queryString) => {
    try {
        const contract = await getContractOrg1(USER);
        const result = await contract.evaluateTransaction('query2', queryString);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.queryTx = async (txID) => {
    try {
        const ch = await getChannal(USER);
        const results = await ch.queryBlockByTxID(txID);
        return results;
    } catch (err) {
        throw err;
    }
}

// Exports for testing
if (process.env.NODE_ENV === 'test') {
    exports.getContractOrg1 = getContractOrg1;
}