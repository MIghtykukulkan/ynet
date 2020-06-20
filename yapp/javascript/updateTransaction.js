const Bridge = require('./bridge');

async function assignToRetailer(issuerUuid, productUuid, reatailerUuid, org){

    return new Promise(async (resolve, reject)=>{
        
        try{
            console.log("calling chaincode")
            let contract = await Bridge.bridge(issuerUuid, org);

        let d = new Date();

        let response = await contract.submitTransaction('assignToRetailer', productUuid , reatailerUuid, d.toDateString());
    
        return resolve(response)
        }
        catch(exception){
            return reject(exception)
        }
    })
  
}

//response string should be ACCEPT/ REJECT
async function retailerResponse(issuerUuid, reatilerUuid, productUuid, responseString, org){

    return new Promise(async (resolve, reject)=>{
        
        try{
            let contract = await Bridge.bridge(issuerUuid, org);

        let d = new Date();
        console.log(issuerUuid, reatilerUuid, productUuid, responseString, org)
        let response = await contract.submitTransaction('retailerResponse', reatilerUuid , productUuid, responseString, d.toDateString());
        console.log(response)    
        return resolve(response)
        }
        catch(exception){
            console.log("*******",exception)  
            return reject(exception)
        }
    })
  
}


async function claimOwnership(issuerUuid, productUuid, org){
    return new Promise(async (resolve, reject)=>{
        
        try{
            let contract = await Bridge.bridge(issuerUuid, org);
            let d = new Date();
            let response = await contract.submitTransaction('claimOwnership', issuerUuid, productUuid ,d.toDateString());
        
        return resolve(response)
        }
        catch(exception){
            return resolve(exception)
        }
    })
}

//response string should be ACCEPT/ REJECT
async function transferOwnerShip(issuerUuid, productUuid, newOwnerUuid, transferType, org){

    return new Promise(async (resolve, reject)=>{
        
        try{
            let contract = await Bridge.bridge(issuerUuid, org);
            let d = new Date();
            let response = await contract.submitTransaction('transferOwnerShip', issuerUuid, productUuid , newOwnerUuid, transferType, d.toDateString());
        
        return resolve(response)
        }
        catch(exception){
            return resolve(exception)
        }
    })
  
}




module.exports = {
    assignToRetailer : assignToRetailer,
    transferOwnerShip : transferOwnerShip,
    retailerResponse :retailerResponse,
    transferOwnerShip: transferOwnerShip,
    claimOwnership : claimOwnership,

}