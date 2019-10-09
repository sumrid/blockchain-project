const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// ทำการอ่านไฟล์ connection.json
const ccpFile = process.env.CCP || 'connection.json';
const ccpPath = path.resolve(__dirname, '..', 'connection_profile', ccpFile);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Set org
ccp.client.organization = process.env.ORG || 'Org1';

async function regis(uid) {
    try {
        console.info(`[${process.env.ORG}] [service] regis`);

        const ADMIN = 'admin';
        const MSP = process.env.MSP || 'Org1MSP';
        const WALLET_NAME = process.env.WALLET || 'wallet1';
        const AFFILIATION = process.env.AFFILIATION || 'org1.department1';
        await register(uid, ADMIN, MSP, WALLET_NAME, AFFILIATION, ccp);
    } catch (error) {
        console.error(`[${process.env.ORG}] [service] register: ${error}`);
        throw error;
    }
}

async function checkUserExists(uid) {
    try {
        const WALLET = process.env.WALLET || 'wallet1';
        const walletPath = path.join(process.cwd(), '..', WALLET);
        const wallet = new FileSystemWallet(walletPath);

        const isUserExixts = await wallet.exists(uid);
        return isUserExixts;
    } catch (error) {
        throw error;
    }
}

async function deleteUser(uid) {
    try {
        const WALLET = process.env.WALLET || 'wallet1';
        const walletPath = path.join(process.cwd(), '..', WALLET);
        const wallet = new FileSystemWallet(walletPath);

        await wallet.delete(uid)
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
        console.info(`[${process.env.ORG}] [service] register: ${userID}, ${admin}, ${msp}, ${walletName}, ${affiliation}, ${ccp}`);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '..', walletName);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`[${process.env.ORG}] [service] Wallet path: ${walletPath}`);

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
        console.error(`[${process.env.ORG}] [service] register: ${err}`);
        throw err;
    }
}

module.exports = {
    regis,
    deleteUser,
    checkUserExists
}