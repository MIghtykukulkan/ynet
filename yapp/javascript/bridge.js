/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const to = require('await-to-js').default;

async function bridge(issuerId, org) {

    return new Promise(async(resolve, reject)=>{
        
  
    try {
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');


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
        const identity = await wallet.get(issuerId);
        if (!identity) {
            console.log('An identity for the user ' + issuerId + ' does not exist in the wallet');
            //console.log('Run the registerUser.js application before retrying');
            return reject('An identity for the user ' + issuerId + ' does not exist in the wallet');
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: issuerId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        return resolve(contract);


    } catch (error) {
        console.error(`Faied connection: ${error}`);
        return reject("error occured", error);
        //process.exit(1);
    }

});
}
 
module.exports = {bridge:bridge}
