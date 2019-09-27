const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// ทำการอ่านไฟล์ connection.json
const ccpFile = process.env.CCP || 'connection.json';
const ccpPath = path.resolve(__dirname, '..', 'connection_profile', ccpFile);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Set org
ccp.client.organization = process.env.ORG || 'Org1';
const WALLET = process.env.WALLET || 'wallet1';


// Function name in chaincode
const USER = 'user1';
const FN_QUERY = 'query';
const FN_DONATE = 'donate';
const FN_CLOSE_PROJECT = 'closeProject';
const FN_UPDATE_PROJECT = 'updateProject'
const FN_CREATE_PROJECT = 'createProject';
const FN_DELETE_PROJECT = 'deleteProject';
const FN_UPDATE_PROJECT_STATUS = 'updateStatus';
const CHANNEL = 'donation';  // ชื่อ channel
const CONTRACT = 'mychaincode'; // ชื่อ chaincode

// #####################
// #    Service  v2    #
// #####################
/**
 * getContract สำหรับฝั่งผู้บริจาค
 * @param {string} user user uid ที่ลงทะเบียนใน CA เรียบร้อยแล้ว
 */
async function getContractOrg(user) {
    try {
        const walletPath = path.join(process.cwd(), '..', WALLET);
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
        const walletPath = path.join(process.cwd(), '..', WALLET);
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

// ##########################################
// #            Query and Invoke
// ##########################################

/**
 * **query any by key**
 * @param {string} key
 */
async function query(key) {
    try {
        const contract = await getContractOrg(USER); // ใช้ผู้ใช้เริ่มต้นก็ได้
        const result = await contract.evaluateTransaction(FN_QUERY, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Query โดยใช้ selector
 * @param { string } queryString ex. {"selector":{"id":{"$regex":"p_"}}}
 */
async function queryWithSelector(queryString) {
    try {
        const contract = await getContractOrg(USER);
        const result = await contract.evaluateTransaction('queryAllWithSelector', queryString);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function queryTx(txID) {
    try {
        const ch = await getChannal(USER);
        const results = await ch.queryBlockByTxID(txID);
        return results;
    } catch (err) {
        throw err;
    }
}

// #####################
// #       โครงการ
// #####################
/**
 * สร้างโครงการเพื่อรับบริจาคเงิน
 * @param {string} useriD
 * @param {object} project
 */
async function createProject(userID, project) {
    try {
        const contract = await getContractOrg(userID); // user ต้องสมัครสมาชิคแล้วเท่านั้น
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

async function updateProject(userID, project) {
    try {
        const contract = await getContractOrg(userID); // TODO func update project
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

/**
 * @param {string} userID uid ของผู้ที่มีส่วนเกี่ยวข้องกับโครงการ
 * @param {string} projectID
 * @param {string} status `Ex. 'open', 'pending', 'close', 'fail'`
 */
async function updateProjectStatus(userID, projectID, status) {
    try {
        const contract = await getContractOrg(userID);
        const result = await contract.submitTransaction(FN_UPDATE_PROJECT_STATUS, userID, projectID, status);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function deleteProject(userID, projectID) {
    try {
        const contract = await getContractOrg(userID);
        const result = await contract.submitTransaction(FN_DELETE_PROJECT, projectID);
        return result;
    } catch (err) {
        throw err;
    }
}

/**
 * @param {string} key project id
 */
async function closeProject(key) {
    try {
        const contract = await getContractOrg(USER); // ผู้ใช้ตั้งต้น
        const result = await contract.submitTransaction(FN_CLOSE_PROJECT, key);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// #####################
// #      Donate
// #####################
async function donate(userID, donation) {
    try {
        const contract = await getContractOrg(userID || USER); // ถ้ายังไม่สมัครจะใช้ id ตั้งต้นหรือ ใช้ anonymous ของ firebase
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

// ################
//     Test zone
// ################
async function test() {
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

module.exports = {
    test,
    query,
    queryTx,
    queryWithSelector,
    closeProject,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    donate,
}