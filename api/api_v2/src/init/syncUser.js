require('../config/firebase');

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const { auth, firestore } = require('firebase-admin');
const userColl = firestore().collection('users');
const path = require('path');
const fs = require('fs');

// ทำการอ่านไฟล์ connection.json
const ccpFile = process.env.CCP || 'connection.json';
const ccpPath = path.resolve(__dirname, '..', 'connection_profile', ccpFile);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


const WALLET = process.env.WALLET || 'wallet1';
const walletPath = path.join(process.cwd(), '..', WALLET);
const wallet = new FileSystemWallet(walletPath);
console.info(`[info] wallet path: ${walletPath}`);

const ADMIN = 'admin';
const CHANNEL = 'donation';  // ชื่อ channel
const CONTRACT = 'mychaincode'; // ชื่อ chaincode
const MSP = 'Org1MSP';
const AFFILIATION = 'org1.department1';
// Set org
ccp.client.organization = process.env.ORG || 'Org1';

async function main() {
    const list = await auth().listUsers();

    for (const key in list.users) {
        const user = list.users[key];
        try {
            console.info('sync user: ' + user.uid);
            const snapshot = await userColl.doc(user.uid).get();
            console.info(`user: ${user.uid} is exixts in database: ${snapshot.exists}`);
            const userData = snapshot.data();
            await addToBlock(user.uid, userData.role);
            await regisToWallet(user.uid);
        } catch (error) {
            console.error(`[error] ${error}`);
        }
    }
    process.exit(); // stop
}

async function addToBlock(uid, role) {
    console.info(`[info] add user: ${uid} to block`);
    try {
        const userExists = await wallet.exists('admin');
        if (!userExists) {
            throw new Error(`An identity for the user "admin" does not exist in the wallet`);
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
        const network = await gateway.getNetwork(CHANNEL); // get channel
        const contract = network.getContract(CONTRACT);
    
        await contract.submitTransaction('addUser', uid, role); // add user
        console.info(`[info] user: ${uid} add to block success.`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function regisToWallet(uid) {
    console.info(`[info] add user: ${uid} to wallet`);

    const userExists = await wallet.exists(uid);
    if (userExists) {
        console.log(`[info] An identity for the user ${uid} already exists in the wallet`);
        return;
    }
    const adminExists = await wallet.exists(ADMIN);
    if (!adminExists) {
        return;
    }
    // Create a new gateway for connecting to our peer node.
    // มีการอ่าน connection profile ที่ได้จาก connection.json
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: ADMIN, discovery: { enabled: false } });

    // Get the CA client object from the gateway for interacting with the CA.
    // จะเรียก client ที่กำหนดไว้ใน connection.json**
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    // 1. register
    // 2. enroll
    const secret = await ca.register({ affiliation: AFFILIATION, enrollmentID: uid, role: 'client' }, adminIdentity);
    const enrollment = await ca.enroll({ enrollmentID: uid, enrollmentSecret: secret });
    const userIdentity = X509WalletMixin.createIdentity(MSP, enrollment.certificate, enrollment.key.toBytes());
    wallet.import(uid, userIdentity);
    console.info(`user: ${uid} regis to wallet`);
}

main()