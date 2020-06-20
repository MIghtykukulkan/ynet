/*
SPDX-License-Identifier: Apache-2.0
*/
'use strict';

// Fabric smart contract classes
const {
    Contract,
    Context
} = require('fabric-contract-api');




class YaliyomoContract extends Contract {


    async initLedger(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
        await ctx.stub.putState('test_key', 'test_data');
    }

    async queryAllCars(ctx) {
        const carAsBytes = await ctx.stub.getState('test_key'); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async testQuery(ctx) {
        return await this.queryAllCars(ctx);
    }


    /*********************************************************************************************** */

/*
    async registerCompany(ctx, company, uuid, txDate) {

        let response = {}
        company = JSON.parse(company)
        company["txDate"] = txDate
        company.blockchainID = uuid;
        company.entityType = "company"
        await ctx.stub.putState(uuid, Buffer.from(JSON.stringify(company)));
        let transactionID = ctx.stub.getTxID();
        response.data = company;
        response.transactionId = transactionID
        //await ctx.stub.InvokeChaincode('qscc', )
        return response;

    }


    async registerUser(ctx, userobjstr, uuid, txDate) {
        let response = {}
        let user = JSON.parse(userobjstr)
        user.entityType = "user"
        user.blockchainID = uuid
        user["txDate"] = txDate;
        await ctx.stub.putState(uuid, Buffer.from(JSON.stringify(user)));
        let transactionID = ctx.stub.getTxID();
        response.data = user;
        response.transactionId = transactionID
        //await ctx.stub.InvokeChaincode('qscc', )
        return response;

    }

    async issueProduct(ctx, issuerid, productStr, uuid, txDate) {

        let response = {}
        let product = JSON.parse(productStr)
       
        let user = await ctx.stub.getState(issuerid)
        console.log("****",user)

        user = JSON.parse(user.toString())

        product.owner = user.company;
        product.entityType = "product"
        product.blockchainID = uuid
        product["txDate"] = txDate;

        await ctx.stub.putState(uuid, Buffer.from(JSON.stringify(product)));
        let transactionID = ctx.stub.getTxID();
        response.data = product;
        response.transactionId = transactionID
        //await ctx.stub.InvokeChaincode('qscc', )
        return response;

    }

    async assignToRetailer(ctx, productId, retailerid, txDate) {
        let retailer = await ctx.stub.getState(retailerid);
        let response = {};
        if (null == retailer) {
            throw "user doesnot exists"
        }

        let updatedProduct = await this.updateState(ctx.stub, productId, "assignedTo", retailerid, txDate)
        let transactionID = ctx.stub.getTxID();
        response.data = updatedProduct;
        response.transactionId = transactionID
        //await ctx.stub.InvokeChaincode('qscc', )
        return response;

    }

    async retailerResponse(ctx, reatilerUuid, productUuid, responseString, txDate) {
        let responseObj = {}

        //check if the product is assigned to the retailer
        let product = await ctx.stub.getState(productUuid);
        product = JSON.parse(product.toString())
        if(product["assignedTo"]!==reatilerUuid){
            throw "product not assigned to the retailer or it has beed rejected from the retailer"
        }

        
        //check if the get the company id of the retailer
        let user = await ctx.stub.getState(reatilerUuid)
        user = JSON.parse(user.toString())
        let companyId = user.company

        if (responseString == "accept") {
            console.log(" retailer agreed with ", productUuid, "owner", companyId, txDate)
            let product = await ctx.stub.getState(productUuid);
            product = JSON.parse(product.toString())      
            product["owner"] = companyId;
            product["txDate"] = txDate;
            product["assignedTo"] = null;
            console.log("==>writing into blockchain", product)
            responseObj = await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));
            
        } else {
            console.log(" retailer rejected")
            responseObj = await this.updateState(ctx.stub, productUuid, "assignedTo", null, txDate)
        }
        let response = {}
        let transactionID = ctx.stub.getTxID();
        console.log(transactionID)
        console.log(responseObj)
        response.data = responseObj;
        response.transactionId = transactionID
        //await ctx.stub.InvokeChaincode('qscc', )
        return response;
    }

    async rejectOwnership(ctx, issuerId, productId, txDate) {
        let product = await ctx.stub.getState(productId);
        let issuer = await ctx.stub.getState(issuerId);
        let response = {};
        
        if(null !== isser.company){
            if(product.owner !== issuer.company){
                throw "product is not owned by the issuer/company"
            }
        }
        else if(product.owner !== issuerId){
                throw "product is not owned by the issuer/company"
            
        }
        
        let updatedProduct = await this.updateState(ctx.stub, productId, "claim", null, txDate)
        let transactionID = ctx.stub.getTxID();
        response.data = updatedProduct;
        response.transactionId = transactionID
        //await ctx.stub.InvokeChaincode('qscc', )
        return response;

    }

    async claimOwnership(ctx, issuerId, productId, txDate) {
        let product = await ctx.stub.getState(productId);
        let response = {};
        
        let updatedProduct = await this.updateState(ctx.stub, productId, "claim", issuerId, txDate)
        let transactionID = ctx.stub.getTxID();
        response.data = updatedProduct;
        response.transactionId = transactionID
        //await ctx.stub.InvokeChaincode('qscc', )
        return response;

    }

    async transferOwnerShip(ctx, issuerId, productId, newOwnerId, transferType, txDate) {
        let issuer = await ctx.stub.getState(issuerId);
        console.log("issuer :",issuer, issuer.toString())
        issuer = JSON.parse(issuer.toString())
       
        let product = await ctx.stub.getState(productId);
        console.log("product :",product, product.toString())
        product = JSON.parse(product.toString())
        
        let newOwner = await ctx.stub.getState(newOwnerId);
        console.log("newOwner :",newOwner, newOwner.toString())
        newOwner = JSON.parse(newOwner.toString())

        let ownershipString = newOwnerId;
        if (transferType = "b2b") {
            if (product["owner"] == issuer["company"]) {
                ownershipString == newOwner["company"]
            }
        }

        if (transferType = "b2c") {
            if (product["owner"] == issuer["company"]) {
                console.log("issuer is the owner of the copany")
                ownershipString == newOwnerId;
            }
            else{
                throw "Issuer of this transaction is not authorized for user"
            }

            if(product["claim"] !== newOwnerId){
                throw "this product has not been claimed by the user specified"
            }
        }

        if (transferType = "c2c") {
            if (product["owner"] == issuerId) {
                ownershipString == newOwnerId;
            }
        }

        let responseObj = await this.updateState(ctx.stub, productId, "owner", ownershipString, txDate)
        let transactionID = ctx.stub.getTxID();
        let response = {}
        response.data = responseObj;
        response.transactionId = transactionID

        return response;

    }

    async updateState(stub, key, attribute, newValue, txDate) {
        let stateObj = await stub.getState(key);
        stateObj = JSON.parse(stateObj.toString())      
        stateObj[attribute] = newValue;
        stateObj["txDate"] = txDate
        console.log("==>writing into blockchain", stateObj)
        await stub.putState(key, Buffer.from(JSON.stringify(stateObj)));
        return stateObj;
    }


    async getuserInfo(ctx, hash) {
        let data = await ctx.stub.getState(hash);
        if (data && data.toString('utf8')) {
            let state = State.deserialize(data);
            return state;
        } else {
            return null;
        }
    }

    async queryByProductId(ctx, productID) {

        let queryString = {};
        queryString.selector = {};
        queryString.selector.productID = productID;
        let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));

        return queryResults[0].Record;

    }

    async queryProductsByOwner(ctx, owner) {

        let queryString = {};
        queryString.selector = {};
        queryString.selector.owner = owner;
        let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));
        return queryResults; //shim.success(queryResults);
    }

    async getQueryResultForQueryString(stub, queryString) {

        console.info('- getQueryResultForQueryString queryString:\n' + queryString)
        let resultsIterator = await stub.getQueryResult(queryString);

        let results = await this.getAllResults(resultsIterator, false);

        return results;
    }


    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.IsDelete = res.value.is_delete.toString();
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }

*/

}

module.exports = YaliyomoContract;