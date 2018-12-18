const pool = require('./db');

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

async function checkPrivilegeAndCookie(cookie, uid, bid, priName) {
    
}

// returns groupid
async function addGroup(name, priority) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call add_group('
            + con.escape(name) + ', '
            + con.escape(priority) + ', @gid);';
        await pool.aQuery(con, cmd);
        cmd = 'select @gid;';
        var res = await pool.aQuery(con, cmd);
        return res[0]['@gid'];
    } catch (err) {
        console.error('[Error][MySQL] add group error', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

module.exports = {
    checkPrivilege,
}