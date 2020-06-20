const Bridge = require('./bridge');

async function addUser(issuerId, user, hash, org){

    let contract = await Bridge.bridge(issuerId, org);
    var d = new Date();
    let response = await contract.submitTransaction('registerUser', user , hash, d.toDateString());

    return response
}

async function addCompany(issuerId, conpanyInfo, companyUuid, org){

    let contract = await Bridge.bridge(issuerId, org);
    var d = new Date();
    let response = await contract.submitTransaction('registerCompany', conpanyInfo , companyUuid, d.toDateString());

    return response
}

module.exports = {addUser:addUser,
                  addCompany:addCompany}