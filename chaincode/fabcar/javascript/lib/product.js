/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');


/**
 * YaliyomoProduct class extends State class
 * Class will be used by application and smart contract to define a product
 */
class YaliyomoProduct extends State {

    constructor(obj) {
        super(YaliyomoProduct.getClass(), [obj.issuer, obj.productID]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getPurchaseDateTime()
    {
        return this.purchaseDateTime;
    }

    setPurchaseDateTime(newDate)
    {
        this.purchaseDateTime = newDate;
    }
    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    /**
     * Useful methods to encapsulate commercial product states
     */
  

    static fromBuffer(buffer) {
        return YaliyomoProduct.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial product
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, YaliyomoProduct);
    }

    /**
     * Factory method to create a commercial product object
     */
    static createInstance(issuer, productID, issueDateTime) {
        return new YaliyomoProduct({ issuer, productID, issueDateTime});
    }

    static getClass() {
        return 'org.ynet.yaliyomoproduct';
    }
}

module.exports = YaliyomoProduct;
