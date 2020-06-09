/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');



const YaliyomoProduct = require('./product.js');
const ProductList = require('./productlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class CommercialPaperContext extends Context {

    constructor() {
        super();

        this.productList = new ProductList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class CommercialPaperContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.ynet.yaliyomoproduct');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new CommercialPaperContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
        await ctx.stub.putState('test_key', 'test_data');
    }

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

    async testQuery (ctx){
        return await this.queryAllCars(ctx); 
    }
   
    async issueProduct(ctx, issuer, companyID, productID, issueDateTime) {

        // create an instance of the paper
        let product = YaliyomoProduct.createInstance(issuer, productID, issueDateTime);

        // Newly issued paper is owned by the issuer
        product.setOwner(companyID);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        console.log()
        await ctx.productList.addProduct(product);

        // Must return a serialized paper to caller of smart contract
        return product;
    }

    

    async transferOwnership(ctx, currentOwner, productID, newOwner, purchaseDateTime) {

        // Retrieve the current paper using key fields provided
        let productKey = YaliyomoProduct.makeKey([productID]);
        console.log("productKey")
        let product = await ctx.productList.getStateByPartialKey(productKey);

        // Validate current owner
        if (product.getOwner() !== currentOwner) {
            throw new Error('product ' + issuer + productID + ' is not owned by ' + currentOwner);
        }

        product.setOwner(newOwner);
        product.setPurchaseDateTime(purchaseDateTime)
        // Update the paper
        await ctx.productList.updateProduct(product);
        return product;
    }

    

    async queryByProductId(ctx, productID){

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

      

    async findHistory(ctx, owner, productID){

        //TODO
        
    }

 

}

module.exports = CommercialPaperContract;
