const pool = require('./db');

// res
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
    } finally {
        pool.release(con);
    }
}

module.exports = {
    checkPrivilege,
}