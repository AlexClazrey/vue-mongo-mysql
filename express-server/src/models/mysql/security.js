const pool = require('./db');
const cook = require('./cookies');
const post = require('./post');

// returns 1(permit) or 0(forbidden) or null(not set)
async function checkPrivilege(uid, bid, priName) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call check_privilege('
            + con.escape(uid) + ', '
            + con.escape(bid) + ', '
            + con.escape(priName) + ', @res);'
        await pool.aQuery(con, cmd);
        cmd = 'select @res;';
        var res = await pool.aQuery(con, cmd);
        return res[0]['@res'];
    } catch (err) {
        console.error('[Error][MySQL] check privilege error', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// cookies can be a string or { user: <string> }
// priName and bid can be null for check uid-cookies pair only
// return null for ok, others merge this into json-response
async function checkPrivilegeAndCookie(cookies, uid, bid, priName) {
    // cookies can be a string or {user: <str>}
    if(typeof cookies === 'object' && !cookies.user) {
        console.warn('[Warn][Req] got an empty cookie:', cookies);
        return {
            badAuth: true
        }
    }
    console.log(arguments);
    if(cookies.user) 
        cookies = cookies.user;
    // check cookies first
    var checkRes = await cook.update(uid, cookies);
    if(checkRes) {
        // check if check only cookies
        if(priName && bid) {
            var boardPri = await checkPrivilege(uid, bid, priName);
            if(boardPri) {
                return null;
            } else {
                return {
                    badPrivilege: true,
                }
            }
        } else {
            return null;
        }
    } else {
        return {
            badAuth: true
        }
    }
}

// if you want to check privilege on board, req.body.bid or req.body.pPid must be set
// return true for hasProblem, return false for ok.
async function autoCheck(req, res, priName) {
    var uid = req.body.uid, bid;
    // if uid-s conflict
    if(req.cookies.uid != req.body.uid) {
        res.send({
            success: false,
            badAuth: true,
        });
        return;
    }
    if(req.body.pPid) {
        bid = await post.getPostBoard(req.body.pPid);
    } else {
        bid = req.body.bid;
    }
    var hasProblem = await checkPrivilegeAndCookie(req.cookies, uid, bid, priName);
    if(hasProblem) {
        hasProblem.success = false;
        res.send(hasProblem);
        return true;
    }
    return false;
}

function updateCookiesMiddleware(req, res, next) {
    if(req.cookies && req.cookies.user && req.cookies.uid) {
        cook.update(req.cookies.uid, req.cookies.user).then(data => {
            if(data)
                console.log('[OK][Mid] Auto update cookies success.');
            else
                console.log('[Info][Mid] Auto update: A cookie is invalid.', req.cookies);
        }).catch(err => {
            console.error('[Error][Mid] Auto update cookies failed.', err);
        });
    }
    next();
}


module.exports = {
    checkPrivilege,
    checkPrivilegeAndCookie,
    autoCheck,
    updateCookiesMiddleware
}