/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection_profile', 'connection2.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
let ccp = JSON.parse(ccpJSON);

// set org for connection
ccp.client.organization = "Org2";
const USER = 'user1';

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '..','..', 'wallet2');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(USER);
        if (!userExists) {
            console.log(`An identity for the user "${USER}" does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: USER, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('donation');

        // Get the contract from the network.
        const contract = network.getContract('mychaincode');


        const selector = {
            selector: {
                type: {
                    $eq: "invoice"
                }
            }
        }

        // const result = await contract.submitTransaction("payBack", "p_02");
        const result = await contract.evaluateTransaction("queryAllWithSelector", JSON.stringify(selector));
        // console.log('Transaction has been submitted ' + String(result));
        console.log(JSON.parse(String(result)));
        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
