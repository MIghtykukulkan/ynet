/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const to = require('await-to-js').default;

async function registerUser(userId, org) {
    return new Promise(async (resolve, reject)=>{
        
        let error, result;
        console.log("calling chaincode to register the user " + userId.toString())
        const username = userId.toString();

        console.log("calling chaincode to register the user " + username)
        var ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        var caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        
        var admin = 'adminOrg1';
        var affiliationStr = 'org1.department1';
        var MSPProvider = "Org1MSP"

        if(org == 'Org2'){
             ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
             ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
             caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
             admin = 'adminOrg2';
             affiliationStr = 'org2.department1';
             MSPProvider = "Org2MSP"
        }
        else if(org == 'Org3') {
             ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
             ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
             caURL = ccp.certificateAuthorities['ca.org3.example.com'].url;
             admin = 'adminOrg3';
             affiliationStr = 'org3.department1';
             MSPProvider = "Org3MSP"
        }

        var ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        console.log("checcking for duplicates .... " + username)
        const userIdentity = await wallet.get(username);
        if (userIdentity) {
            console.log("duplicate exists")
            return reject('An identity for the user '+username+' already exists in the wallet');
           
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get(admin);
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return reject('Run the enrollAdmin.js application before retrying');
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: username,
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: username,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: MSPProvider,
            type: 'X.509',
        };
        console.log("adding user to the wallet")
        //[error, result] = await to(wallet.put(username, x509Identity));
        await wallet.put(username, x509Identity)
        return resolve(username + ' Registered successfully');
      
        
    
    })
     
}

module.exports ={
    registerUser : registerUser
}
