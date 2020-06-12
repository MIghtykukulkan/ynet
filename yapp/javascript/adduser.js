const Bridge = require('./bridge');

async function adduser(issuerId, user, hash, org){

    let contract = await Bridge.bridge(issuerId, org);

    let response = await contract.submitTransaction('registerUser', user , hash);

    return response
}

module.exports = {adduser:adduser}