const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// ทำการอ่านไฟล์ connection.json
const ccpFile = process.env.CCP || 'connection3.json';
const ccpPath = path.resolve(__dirname, 'connection_profile', ccpFile);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


// Function name in chaincode
const USER = 'user1'; // ผู้ใช้เริ่มต้น
const FN_QUERY = 'query';
const FN_DONATE = 'donate';
const FN_GET_HISTORY = 'getHistory';
const FN_CLOSE_PROJECT = 'closeProject';
const FN_UPDATE_PROJECT = 'updateProject'
const FN_CREATE_PROJECT = 'createProject';
const FN_DELETE_PROJECT = 'deleteProject';
const FN_QUERY_PROJECTS = 'queryAllProjects';
const FN_UPDATE_PROJECT_STATUS = 'updateStatus';
const FN_GET_DONATE_HISTORY = 'getDonationHistory';
const FN_GET_PROJECT_BY_USER = 'queryProjectByUserID';
const FN_GET_DONATION_BY_USERID = 'queryDonationByUserID';
const FN_GET_PROJECT_BY_RECEIVER = 'queryProjectByReceiverID'
const CHANNEL = 'donation';  // ชื่อ channel
const CONTRACT = 'mychaincode'; // ชื่อ chaincode

// #####################
// #    Service  v2    #
// #####################

exports.registerReceiver = async (uid) => {
    try {
        const ADMIN = 'admin';
        const MSP = 'Org3MSP';
        const WALLET_NAME = 'wallet3';
        const AFFILIATION = 'org3.department1';
        await register(uid, ADMIN, MSP, WALLET_NAME, AFFILIATION, ccp);
    } catch (error) {
        throw error;
    }
}
/**
 * register **ทำการลงทะเบียนแล้วเก็บ key ไว้ใน wallet**
 * @param {string} userID uid ของผู้ใช้งาน
 * @param {string} admin admin name
 * @param {string} msp ชื่อ MSP
 * @param {string} walletName wallet name
 * @param {string} affiliation ...
 * @param {*} ccp connection profile
 */
async function register(userID, admin, msp, walletName, affiliation, ccp) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '..', walletName);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        // ตรวจสอบว่ามี user อยู่แล้วหรือไม่
        const userExists = await wallet.exists(userID);
        if (userExists) {
            console.log(`An identity for the user ${userID} already exists in the wallet`);
            throw new Error('This user already exists in the wallet');
        }

        // Check to see if we've already enrolled the admin user.
        // เป็นการเรียก admin user ออกมา
        const adminExists = await wallet.exists(admin);
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            throw new Error('An identity for the admin user "admin" does not exist in the wallet');
        }

        // Create a new gateway for connecting to our peer node.
        // มีการอ่าน connection profile ที่ได้จาก connection.json
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: admin, discovery: { enabled: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        // จะเรียก client ที่กำหนดไว้ใน connection.json**
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        // 1. register
        // 2. enroll
        const secret = await ca.register({ affiliation: affiliation, enrollmentID: userID, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: userID, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity(msp, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(userID, userIdentity);
        console.log(`Successfully registered and enrolled admin user "${userID}" and imported it into the wallet`);
    } catch (err) {
        throw err;
    }
}

/**
 * getContract สำหรับฝั่งผู้บริจาค
 * @param {string} user user uid ที่ลงทะเบียนใน CA เรียบร้อยแล้ว
 */
async function getContractOrg(user) {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet3');
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

async function getChannal(user) {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet3');
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

/**
 * **query any by key**
 * @param {string} key
 */
exports.query = async (key) => {
    try {
        const contract = await getContractOrg(USER); // ใช้ผู้ใช้เริ่มต้นก็ได้
        const result = await contract.evaluateTransaction(FN_QUERY, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.updateProject = async (userID, project) => {
    try {
        const contract = await getContractOrg2(userID); // TODO func update project
        const result = await contract.
            submitTransaction(
                FN_UPDATE_PROJECT,
                project.id,
                project.title
            )
        return result;
    } catch (err) {
        throw err;
    }
}

exports.deleteProject = async (userID, projectID) => {
    try {
        const contract = await getContractOrg2(userID);
        const result = await contract.submitTransaction(FN_DELETE_PROJECT, projectID);
        return result;
    } catch (err) {
        throw err;
    }
}

exports.getHistory = async (key) => {
    try {
        const contract = await getContractOrg(USER); // ใช้ userตั้งต้น
        const result = await contract.evaluateTransaction(FN_GET_HISTORY, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.getDonationHistory = async (key) => {
    try {
        const contract = await getContractOrg(USER); // ผู้ใช้ตั้งต้น
        const result = await contract.evaluateTransaction(FN_GET_DONATE_HISTORY, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.getAllProjects = async () => {
    try {
        const contract = await getContractOrg(USER); // ผู้ใช้ตั้งต้น
        const result = await contract.evaluateTransaction(FN_QUERY_PROJECTS);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * @param {string} uid UID of project owner.
 */
exports.getAllProjectsByUserID = async (uid) => {
    try {
        const contract = await getContractOrg2(USER);
        const result = await contract.evaluateTransaction(FN_GET_PROJECT_BY_USER, uid);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.getAllProjectsByReceiverID = async (uid) => {
    try {
        const contract = await getContractOrg2(USER);
        const result = await contract.evaluateTransaction(FN_GET_PROJECT_BY_RECEIVER, uid);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * @param {string} userID uid ของผู้ที่มีส่วนเกี่ยวข้องกับโครงการ
 * @param {string} projectID
 * @param {string} status `Ex. 'open', 'pending', 'close', 'fail'`
 */
exports.updateProjectStatus = async (userID, projectID, status) => {
    try {
        const contract = await getContractOrg(userID); // TODO org3 or org2
        const result = await contract.submitTransaction(FN_UPDATE_PROJECT_STATUS, userID, projectID, status);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.getDonationByUserID = async (userID) => {
    try {
        const contract = await getContractOrg(USER);
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

// Exports for testing
if (process.env.NODE_ENV === 'test') {
    exports.getContractOrg = getContractOrg;
    exports.getContractOrg2 = getContractOrg2;
    exports.FN_CLOSE_PROJECT = FN_CLOSE_PROJECT;
    exports.FN_CREATE_PROJECT = FN_CREATE_PROJECT;
    exports.FN_DONATE = FN_DONATE;
    exports.FN_GET_DONATE_HISTORY = FN_GET_DONATE_HISTORY;
    exports.FN_GET_DONATION_BY_USERID = FN_GET_DONATION_BY_USERID;
    exports.FN_GET_HISTORY = FN_GET_HISTORY;
    exports.FN_QUERY = FN_QUERY;
    exports.FN_QUERY_PROJECTS = FN_QUERY_PROJECTS;
    exports.CHANNEL = CHANNEL;
    exports.CONTRACT = CONTRACT;
}