/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection_profile', 'connection.json');   // ที่อยู่ไฟล์ xxx.json
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');  // อ่านไฟล์
const ccp = JSON.parse(ccpJSON);         // เปลี่ยน string เป็น json

const ADMIN = `admin`;

async function main() {
    for (let i = 1; i < 4; i++) {
        const WALLET_NAME = `wallet${i}`;
        const ORG_MSP = `Org${i}MSP`;
        const CA_NAME = `ca${i}.example.com`;
        ccp.client.organization = `Org${i}`;
        console.log(ccp.client.organization);
        await enroll(WALLET_NAME, ORG_MSP, CA_NAME);
    }
}

async function enroll(WALLET_NAME, ORG_MSP, CA_NAME) {
    try {

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[CA_NAME].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        // path ./wallet
        const walletPath = path.join(__dirname, '..', '..', WALLET_NAME);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);


        // ################
        //   Enroll admin
        // ################
        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(ADMIN);
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: ADMIN, enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity(ORG_MSP, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(ADMIN, identity);
        console.log(`Successfully enrolled admin user "${ADMIN}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll admin user "${ADMIN}": ${error}`);
        process.exit(1);
    }
}

main();
