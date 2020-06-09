

const EnrollAdmin = require('./javascript/enrollAdmin');
const RegisterUser = require('./javascript/registerUser');
const Issue = require('./javascript/issue');
const Purchase = require('./javascript/purchase');
const Query = require('./javascript/query');


module.exports = router => {

 router.get('/enrollAdmin',
 async (req,res)=>{
     let error, result, finaljson;
     //----------------only modify this portion--------------
     await EnrollAdmin.enrollAdmin("Org1");
     await EnrollAdmin.enrollAdmin("Org2");
     await EnrollAdmin.enrollAdmin("Org3");

     res.json("Admin enrolled successfully for Org1, Org2 and Org3")
     
 });

 router.post('/registerUser',
 async (req,res)=>{
     let error, result;    
     var finaljson = {}
     var userId = req.body['userId']
     var org = req.body['org']
    console.log(userId,org)
    result =  await RegisterUser.registerUser(userId,org)
    res.json({"result": result});
     
 });

 router.post('/addProduct',
 async (req,res)=>{
     let error, result, finaljson;    
     let issuerId = req.body['issuerId']
     let productId = req.body['productId']
     let org = req.body['org']
     result = await Issue.issue(issuerId, productId, org);
     res.json({"result": result});
    
     
 }); 

 router.post('/trasferOwnership', 
 async (req,res)=>{
     let error, result, finaljson;    
     let currentOwner = req.body['currentOwner']
     let newOwner = req.body['newOwner']
     let productId = req.body['productId']
     let org = req.body['org']

     result = await Purchase.purchase(currentOwner , productId, newOwner , org)
     res.json({"result": result});
     
 });

 router.post('/queryProduct',
 async (req,res)=>{
     let error, result, finaljson;    
     let owner = req.body['owner']
     let productId = req.body['productId']
     let org = req.body['org']
     result = await Query.queryProduct(owner, productId, org)
     res.json({"result": result});
     
 });




}