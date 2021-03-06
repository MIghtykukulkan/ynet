const EnrollAdmin = require('./javascript/enrollAdmin');
const RegisterUser = require('./javascript/registerUser');
const Issue = require('./javascript/issue');
const Purchase = require('./javascript/purchase');
const Query = require('./javascript/query');
const Adduser = require('./javascript/adduser');
var ab2str = require('arraybuffer-to-string')
var crypto = require('crypto');


async function main(){

  await EnrollAdmin.enrollAdmin("Org1")
  await RegisterUser.registerUser("b1","Org1")
  await Issue.issue("b1", "P001", "Org1")
  await Issue.issue("b1", "P002", "Org1")
  await Issue.issue("b1", "P003", "Org1")

  var respo = await Query.queryProduct("b1", "P001", "Org1")
  console.log(respo)

}

async function enrollUsers(){
  await EnrollAdmin.enrollAdmin("Org1")
  await RegisterUser.registerUser("b2","Org1")
  
  
  await EnrollAdmin.enrollAdmin("Org2")
  await RegisterUser.registerUser("r2","Org2")
  
}

async function issueProducts(){


    await Issue.issue("b2", "P001", "nike","Org1")
    await Issue.issue("b2", "P002", "nike", "Org1")
    await Issue.issue("b2", "P003", "nike", "Org1")
//await Issue.issue("r1", "PR001", "rebook", "Org2")
}

async function transfer(){
await Purchase.purchase("b2" , "P001", "r1" , "Org1")
}

async function query(){
  var respo = await Query.queryProduct("b2", "P003", "Org1")
  //var respo = await Query.queryProduct("r1", "P001", "Org2")
  console.log(respo)


 
}

async function adduser(){

  var uniqueNumber = Date.now().toString();
 let hash = crypto.createHash('sha256').update(uniqueNumber).digest('hex')
 let user = {};
 user.name = "test user";
 user.company = "techwave";
 user.email = "something@abc.com"
 var response = await Adduser.adduser('b2', JSON.stringify(user), hash, "Org1" )
 console.log(Buffer.from(response).toString('utf8'))
}

//enrollUsers()
adduser()
//issueProducts()
//transfer()
//query()
//main()
//var uniqueNumber = Date.now().toString();
//console.log(crypto.createHash('sha256').update(uniqueNumber).digest('hex'))

/*
var buffer = {"type":"Buffer","data":[91,123,34,75,101,121,34,58,34,92,117,48,48,48,48,111,114,103,46,121,110,101,116,46,121,97,108,105,121,111,109,111,112,114,111,100,117,99,116,108,105,115,116,92,117,48,48,48,48,92,34,98,49,92,34,92,117,48,48,48,48,92,34,80,48,48,49,92,34,92,117,48,48,48,48,92,34,98,49,92,34,92,117,48,48,48,48,34,44,34,82,101,99,111,114,100,34,58,123,34,99,108,97,115,115,34,58,34,111,114,103,46,121,110,101,116,46,121,97,108,105,121,111,109,111,112,114,111,100,117,99,116,34,44,34,99,117,114,114,101,110,116,83,116,97,116,101,34,58,110,117,108,108,44,34,105,115,115,117,101,68,97,116,101,84,105,109,101,34,58,34,84,117,101,32,74,117,110,32,48,57,32,50,48,50,48,34,44,34,105,115,115,117,101,114,34,58,34,98,49,34,44,34,107,101,121,34,58,34,92,34,98,49,92,34,58,92,34,80,48,48,49,92,34,58,92,34,98,49,92,34,34,44,34,111,119,110,101,114,34,58,34,98,49,34,44,34,112,114,111,100,117,99,116,73,68,34,58,34,80,48,48,49,34,125,125,44,123,34,75,101,121,34,58,34,92,117,48,48,48,48,111,114,103,46,121,110,101,116,46,121,97,108,105,121,111,109,111,112,114,111,100,117,99,116,108,105,115,116,92,117,48,48,48,48,92,34,98,49,92,34,92,117,48,48,48,48,92,34,80,48,48,50,92,34,92,117,48,48,48,48,92,34,98,49,92,34,92,117,48,48,48,48,34,44,34,82,101,99,111,114,100,34,58,123,34,99,108,97,115,115,34,58,34,111,114,103,46,121,110,101,116,46,121,97,108,105,121,111,109,111,112,114,111,100,117,99,116,34,44,34,99,117,114,114,101,110,116,83,116,97,116,101,34,58,110,117,108,108,44,34,105,115,115,117,101,68,97,116,101,84,105,109,101,34,58,34,84,117,101,32,74,117,110,32,48,57,32,50,48,50,48,34,44,34,105,115,115,117,101,114,34,58,34,98,49,34,44,34,107,101,121,34,58,34,92,34,98,49,92,34,58,92,34,80,48,48,50,92,34,58,92,34,98,49,92,34,34,44,34,111,119,110,101,114,34,58,34,98,49,34,44,34,112,114,111,100,117,99,116,73,68,34,58,34,80,48,48,50,34,125,125,44,123,34,75,101,121,34,58,34,92,117,48,48,48,48,111,114,103,46,121,110,101,116,46,121,97,108,105,121,111,109,111,112,114,111,100,117,99,116,108,105,115,116,92,117,48,48,48,48,92,34,98,49,92,34,92,117,48,48,48,48,92,34,80,48,48,51,92,34,92,117,48,48,48,48,92,34,98,49,92,34,92,117,48,48,48,48,34,44,34,82,101,99,111,114,100,34,58,123,34,99,108,97,115,115,34,58,34,111,114,103,46,121,110,101,116,46,121,97,108,105,121,111,109,111,112,114,111,100,117,99,116,34,44,34,99,117,114,114,101,110,116,83,116,97,116,101,34,58,110,117,108,108,44,34,105,115,115,117,101,68,97,116,101,84,105,109,101,34,58,34,84,117,101,32,74,117,110,32,48,57,32,50,48,50,48,34,44,34,105,115,115,117,101,114,34,58,34,98,49,34,44,34,107,101,121,34,58,34,92,34,98,49,92,34,58,92,34,80,48,48,51,92,34,58,92,34,98,49,92,34,34,44,34,111,119,110,101,114,34,58,34,98,49,34,44,34,112,114,111,100,117,99,116,73,68,34,58,34,80,48,48,51,34,125,125,93]};
var str = ab2str(buffer, encoding='utf8')

console.log(Buffer.from(buffer).toString('utf8'))
//console.log(str)
*/