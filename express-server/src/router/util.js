const sec = require('../models/mysql/security');

// leave priName and bid to be empty to skip privilege check
async function simpleModelCall(req, res, modelAsyncFunction, bid, priName) {
    await modelCall(req, res, modelAsyncFunction, null, null, bid, priName);
}

async function modelCall(req, res, modelAsyncFunction, modelArguments, modelDataCallback, bid, priName) {
    try {
        // secure process
        if(priName) {
            var uid = req.cookies.uid;
            var hasProblem = await sec.checkPrivilegeAndCookie(req.cookies, uid, bid, priName);
            if(hasProblem) {
                hasProblem.success = false;
                res.send(hasProblem);
                return;
            }
        }
        modelArguments = modelArguments ? modelArguments : [];
        var data = await modelAsyncFunction(...modelArguments);
        if(data)
            if(modelDataCallback)
                modelDataCallback(data);
            else
                res.send({
                    success: true,
                    data,
                })
        else
            res.send({success: true});
    } catch(err) {
        res.send({success: false});
    }
}

module.exports = {
    simpleModelCall,
    modelCall
}