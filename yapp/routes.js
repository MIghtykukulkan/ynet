const EnrollAdmin = require('./javascript/enrollAdmin');
const RegisterUser = require('./javascript/registerUser');
const Adduser = require('./javascript/adduser');
const Issue = require('./javascript/issue');
const UpdateTransaction = require('./javascript/updateTransaction');
const Query = require('./javascript/query');
const Init = require('./javascript/initialize');



// Initiallizing SDK by creating Admin and default users


async function init() {
	let generateUsers = await Init.initialize();
	console.log(generateUsers);
}

let start = async function(){
	try {
		await init();    
	} catch (exception) {
		console.log(exception);
	}
}

start();


module.exports = router => {

		router.get('/enrollAdmin',
			async(req, res) => {
				let error, result, finaljson;
				//----------------only modify this portion--------------
				await EnrollAdmin.enrollAdmin("Org1");
				await EnrollAdmin.enrollAdmin("Org2");
				await EnrollAdmin.enrollAdmin("Org3");

				res.json("Admin enrolled successfully for Org1, Org2 and Org3")

			});

		/*@params useruuid, userobjstr, usertype, company, org 
		 */

		router.post('/registerCompany', async(req, res) => {
			try {
				let companyUuid = req.body['companyUuid']
				let companyInfo = req.body['companyInfo']
				if(typeof(companyInfo)=="string")
					companyInfo = JSON.parse(companyInfo)

				result = await Adduser.addCompany("default1", JSON.stringify(companyInfo), companyUuid, "Org1");
				return res.json({
					"result": Buffer.from(result).toString('utf8')
				});
			} catch (exception) {
				return res.send(exception)
			}
		})

		router.post('/registerUser',
			async(req, res) => {

				try {

					var finaljson = {}
					var useruuid = req.body['userUuid']
					var userObj = req.body['userObjStr']
					if(typeof(userObj)=="string"){
						userObj = JSON.parse(userObj)
					}
				   
					var associatedCompanyId = userObj['dealsWith']
					console.log(associatedCompanyId)
					console.log("***",userObj)
					var org = req.body['org']

					//check if company details are mentioned
					//reatiler and brandowner should have companyID
					//reatiler should have association
					if(null == userObj.userType){
						res.json({
							"Exception": "missing usertype = brandowner/ retailer/ consumer"
						})
					}
					else{
						userObj.userType = userObj.userType.toLowerCase();
					}

				
					if (userObj.userType == "brandowner" || userObj.userType == "retailer") {
						if (!userObj.company) {
							res.json({
								"Exception": "missing company id for the usertype"
							})
						}

					}

					if (userObj.userType == "retailer") {
						userObj["dealsWith"]  = [associatedCompanyId]
						console.log("*** adding deals with in an array",userObj)
					}


					console.log(JSON.stringify(userObj), useruuid, org)
					let result = await RegisterUser.registerUser(useruuid, org)
					if (null !== result) {
						result = await Adduser.addUser("default1", JSON.stringify(userObj), useruuid,  org);
					}

					return res.json({
						"result": Buffer.from(result).toString('utf8')
					});
				} catch (rejectedstring) {
					return res.send(rejectedstring)
				}

			});

		router.post('/addProduct',
			async(req, res) => {

				try {

					let issuerUuid = req.body['issuerUuid']
					let productObjStr = req.body['productObjStr']
					if(typeof(productObjStr)=="string")
						productObjStr = JSON.parse(productObjStr)
					let uuid = req.body['productUuid']
					let org = req.body['org']
					let result = await Issue.issue(issuerUuid, JSON.stringify(productObjStr), uuid, org);
					res.json({
						"result": Buffer.from(result).toString('utf8')
					});
				} catch (exception) {
					res.json({
						"error": exception
					})
				}
			});


		//issuer, productid, reatailerid
		router.post('/assignproduct', async(req, res) => {
			try {
				let issuerUuid = req.body['issuerUuid']
				let productUuid = req.body['productUuid']
				let reatailerUuid = req.body['reatailerUuid']
				let org = req.body['org']
				let result = await UpdateTransaction.assignToRetailer(issuerUuid, productUuid, reatailerUuid, org);
				console.log(result)
				console.log("converting the buffer to string")
				console.log(Buffer.from(result).toString('utf8'))
				res.json({
					"result": Buffer.from(result).toString('utf8')
				});
			} catch (exception) {
				res.json({
					"error": exception
				})
			}
		})

		//response string should be ACCEPT/ REJECT
		router.post('/retailerResponse', async(req, res) => {
			try {
                let issuerUuid = req.body['issuerUuid']
                let retailerUuid = req.body['retailerUuid']
				let productUuid = req.body['productUuid'];
				let responseString = req.body['responseString']
				responseString = responseString.toLowerCase();
				let org = req.body['org']
				
				if ((responseString !== "accept") && (responseString !== "reject")) {
					throw ("invalid response string")
				}

				let result = await UpdateTransaction.retailerResponse(issuerUuid, retailerUuid, productUuid, responseString, org);
				console.log(result)
				res.json({
					"result": Buffer.from(result).toString('utf8')
				});
			} catch (exception) {
				res.json({
					"error": exception
				})
			}
		})

		router.post('/claimOwnership', async(req, res) => {
			try {

				let issuerUuid = req.body['issuerUuid']
				let productUuid = req.body['productUuid'];

				let org = req.body['org']
				let result = await UpdateTransaction.claimOwnership(issuerUuid, productUuid, org);
				res.json({
					"result": Buffer.from(result).toString('utf8')
				});
			} catch (exception) {
				res.json({
					"error": exception
				})
			}
		})

		router.post('/transferOwnership', async(req, res) => {
			try {

				let issuerUuid = req.body['issuerUuid']
				let productUuid = req.body['productUuid'];
				let newOwnerUuid = req.body['newOwnerUuid'];
				let transferType = req.body['transferType']; // b2b, b2c, c2c
				let org = req.body['org']
				let result = await UpdateTransaction.transferOwnerShip(issuerUuid, productUuid, newOwnerUuid, transferType, org);
				console.log(result)
				res.json({
					"result": Buffer.from(result).toString('utf8')
				});
			} catch (exception) {
				res.json({
					"error": exception
				})
			}
		})

		


        /******************Routes correcponding to Queries********************************/

		router.post('/queryProduct', async(req, res) => {
    
        try{           
            let issuerUuid = req.body['issuerUuid']
            let productUuid = req.body['productUuid'];
            let result = await Query.queryProduct(issuerUuid, productUuid, org)
            res.json({
                "result": Buffer.from(result).toString('utf8')
            });
        }
        catch(exception){
            res.error({
                "error": exception
            })
        }

		});

		router.post('/queryproductbyownership', async(req, res) => {
			try {

			} catch (error) {

			}
		})

		router.post('/listallretailers', async(req, res) => {
			try {

			} catch (error) {

			}
		})

		router.post('/listallretailers', async(req, res) => {
			try {

			} catch (error) {

			}
		})

		router.post('/getbyquerystring', async(req, res) => {
			try {

			} catch (error) {

			}
        })
        
    }