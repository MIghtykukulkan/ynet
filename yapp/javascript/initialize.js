const EnrollAdmin = require('./enrollAdmin');
const RegisterUser = require('./registerUser');

async function initialize(){

    return new Promise (async (resolve, reject) => {
        try{
            console.log("generating Admins and default users")
            await EnrollAdmin.enrollAdmin("Org1");
            await EnrollAdmin.enrollAdmin("Org2");
            await EnrollAdmin.enrollAdmin("Org3");

            await RegisterUser.registerUser("default1","Org1")
            await RegisterUser.registerUser("default2","Org2")
            await RegisterUser.registerUser("default3","Org3")

            return resolve ("Admin and Default Users created Successfully")
        }
        catch(error){
            reject(error)
        }
       

    })
    


}

module.exports = {
    initialize : initialize
}