/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function purchase(currentOwner , productid, newOwner , org) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        
        if(org == 'Org2'){
            ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        }
        else if(org == 'Org3'){
            ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        }

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(currentOwner);
        if (!identity) {
            console.log('An identity for the user '+currentOwner+' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: currentOwner, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        //issueProduct(ctx, issuer, productID, issueDateTime)
        var d = new Date();
 
        let resp = await contract.submitTransaction('transferOwnership', currentOwner, productid,newOwner, d.toDateString());
        return('Transaction has been submitted', resp.toString());

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        throw(`Failed to submit transaction: ${error}`);
       
    }
}

module.exports = {purchase : purchase}