/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Bridge = require('./bridge');

async function issue(issuerUuid, productObjStr, uuid, org) {

    let contract = await Bridge.bridge(issuerUuid, org);
    var d = new Date();
    let response =  await contract.submitTransaction('issueProduct', issuerUuid , productObjStr, uuid , d.toDateString());
    return response

}
 
module.exports = {issue:issue}
