/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function enrollAdmin(org) {
    try {
        // load the network configuration
        
        var ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        var caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        var admin = 'adminOrg1'
        var MSPProvider = "Org1MSP"
        if(org == "Org2"){
             ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
             ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
             caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
             admin = 'adminOrg2';
             MSPProvider = "Org2MSP"
        }
        else if(org == "Org3") {
             ccpPath = path.resolve(__dirname, '..', '..', 'y-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
             ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
             caInfo = ccp.certificateAuthorities['ca.org3.example.com'];
             admin = 'adminOrg3';
             MSPProvider = "Org3MSP"
        }

        console.log("****************", admin, org)
        
        

        // Create a new CA client for interacting with the CA.
        
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(admin);
        if (identity) {
            return('An identity for the admin user "admin" already exists in the wallet');
           
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: MSPProvider,
            type: 'X.509',
        };
        await wallet.put(admin, x509Identity);
        return('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        throw("error")
    }
}

module.exports = {
    enrollAdmin : enrollAdmin
}
