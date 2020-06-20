const Bridge = require('./bridge');

async function queryProduct(issuerUuid, productUuid, org){

    return new Promise(async (resolve, reject)=>{
        
        try{
            let contract = await Bridge.bridge(issuerUuid, org);

        let d = new Date();
        let response = await contract.submitTransaction('assignToRetailer', productUuid);
    
        return resolve(response)
        }
        catch(exception){
            return resolve(exception)
        }
    })
  
}

module.exports = {
    queryProduct : queryProduct
}