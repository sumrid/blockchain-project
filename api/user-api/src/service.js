/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Read connection profile.
const fileOrg1 = process.env.CCP1;
const fileOrg2 = process.env.CCP2;
const ccpPath1 = path.resolve(__dirname, 'connection_profile', fileOrg1);
const ccpJSON1 = fs.readFileSync(ccpPath1, 'utf8');
const ccpOrg1 = JSON.parse(ccpJSON1);
const ccpPath2 = path.resolve(__dirname, 'connection_profile', fileOrg2);
const ccpJSON2 = fs.readFileSync(ccpPath2, 'utf8');
const ccpOrg2 = JSON.parse(ccpJSON2);

exports.registerDonator = async (userID) => {
    try {
        const ADMIN = 'admin';
        const MSP = 'Org1MSP';
        const WALLET_NAME = 'wallet1';
        const AFFILIATION = 'org1.department1';
        await register(userID, ADMIN, MSP, WALLET_NAME, AFFILIATION, ccpOrg1);
    } catch (err) {
        throw err;
    }
}
exports.registerCreator = async (userID) => {
    try {
        const ADMIN = 'admin';
        const MSP = 'Org2MSP';
        const WALLET_NAME = 'wallet2';
        const AFFILIATION = 'org2.department1';
        await register(userID, ADMIN, MSP, WALLET_NAME, AFFILIATION, ccpOrg2);
    } catch (err) {
        throw err;
    }
}
exports.checkUserExists = async (userID) => {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet1');
        const wallet = new FileSystemWallet(walletPath);
        const walletPath2 = path.join(process.cwd(), '..', 'wallet2');
        const wallet2 = new FileSystemWallet(walletPath2);

        const [ex1, ex2] = await Promise.all([wallet.exists(userID), wallet2.exists(userID)]);
        if (ex1 || ex2) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw err;
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