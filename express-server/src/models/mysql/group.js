const pool = require('./db');

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

async function addUserToGroup(uid, gid, bid) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call add_user_to_group('
            + con.escape(uid) + ', '
            + con.escape(gid) + ', '
            + con.escape(bid) + ');'
        await pool.aQuery(con, cmd);
    } catch (err) {
        console.error('[Error][MySQL] add user to group error', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

module.exports = {
    addGroup,
    addUserToGroup,
}