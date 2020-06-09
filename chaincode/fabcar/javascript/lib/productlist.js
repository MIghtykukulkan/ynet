/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const YaliyomoProduct = require('./product.js');

class ProductList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.ynet.yaliyomoproductlist');
        this.use(YaliyomoProduct);
    }

    async addProduct(product) {
        return this.addState(product);
    }

    async getProduct(productKey) {
        return this.getState(productKey);
    }

    async getProductByPartialKey(productKey) {
        return this.getStateByPartialKey(productKey);
    }

    async updateProduct(product) {
        return this.updateState(product);
    }
}


module.exports = ProductList;