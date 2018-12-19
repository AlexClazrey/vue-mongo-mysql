const pool = require('./db');
const user = require('./user');

// ER_NO_REFERENCED_ROW how can I report this error to the browser

// return [{id: <gid>, priority: <int>} ... ]
async function listGroup() {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'select `id`, `name`, `priority` from `group`;';
        var res = await pool.aQuery(con, cmd);
        return res;
    } catch (err) {
        console.error('[Error][MySQL] list group error', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
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

// no return
async function removeGroup(gid) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call delete_group(' + con.escape(gid) + ');';
        await pool.aQuery(con, cmd);
    } catch(err) {
        console.error('[Error][MySQL] delete group error', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

async function listUserToGroup() {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'select `user_id` as uid, `group_id` as gid, `board_id` as bid from user_to_group;';
        var res = await pool.aQuery(con, cmd);
        return res;
    } catch(err) {
        console.error('[Error][MySQL] list user to group error', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// no return
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

// no return
async function removeUserFromGroup(uid, gid, bid) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call delete_user_from_group('
            + con.escape(uid) + ', '
            + con.escape(gid) + ', '
            + con.escape(bid) + ');'
        await pool.aQuery(con, cmd);
    } catch (err) {
        console.error('[Error][MySQL] delete user from group failed', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// return [ { id: <pri_id>, name: <string> } ... ]
async function listPrivilege() {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'select `id`, `name` from `privilege`;';
        var res = await pool.aQuery(con, cmd);
        return res;
    } catch (err) {
        console.error('[Error][MySQL] list privilege error', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// return pri_id
async function addPrivilege(name) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call add_privilege(' + con.escape(name) + ', @pri_id);';
        await pool.aQuery(con, cmd);
        cmd = 'select @pri_id;';
        var res = await pool.aQuery(con, cmd);
        return res[0]['@pri_id'];
    } catch (err) {
        console.error('[Error][MySQL] add privilege error', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// no return
async function removePrivilege(pri_id) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call delete_privilege(' + con.escape(pri_id) + ');';
        await pool.aQuery(con, cmd);
    } catch(err) {
        console.error('[Error][MySQL] delete privilege failed', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// returns [{gid: <gid>, priId: <privilege id>, permit: <1 or 0>} ... ]
async function listPrivilegeToGroup() {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'select `group_id` as gid, `privilege_id`as pri_id, `permit` from `group_to_privilege`;'
        var res = await pool.aQuery(con, cmd);
        return res.map(entry => {
            return {
                gid: entry.gid,
                priId: entry.pri_id,
                permit: entry.permit
            };
        });
    } catch (err) {
        console.error('[Error][MySQL] list privilege to group failed', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// no return
async function addPrivilegeToGroup(pri_id, gid, permit) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call add_privilege_to_group('
            + con.escape(pri_id) + ', '
            + con.escape(gid) + ', '
            + con.escape(permit) + ');'
        await pool.aQuery(con, cmd);
    } catch (err) {
        console.error('[Error][MySQL] add privilege to group failed', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// no return
// TODO remove item should return a deleted line number;
async function removePrivilegeFromGroup(pri_id, gid) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call delete_privilege_from_group('
            + con.escape(pri_id) + ', '
            + con.escape(gid) + ');';
        await pool.aQuery(con, cmd);
    } catch (err) {
        console.error('[Error][MySQL] delete privilege from group failed', cmd);
        throw err;
    } finally {
        pool.release(con);
    }
}

// provide uid or username to list his/her privileges
// if you provide both, I will use uid.
// returns [ {uid: uid, gid: gid, bid: bid, priId: privilege id} ... ]
async function checkUserPrivilegeList(uid, username) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'select uid, gid, bid, pri_id, permit from v_user_privilege ';
        if(uid) {
            cmd += 'where uid = ' + con.escape(uid) + ';';
        } else if (username) {
            uid = await user.getUidFromUsername(username);
            if(uid) {
                cmd += 'where uid = ' + con.escape(uid) + ';';
            } else {
                throw new Error('There is no user with username ' + con.escape(username));
            }
        } else {
            throw new Error('You should give a user id or username.');
        }
        var res = await pool.aQuery(con, cmd);
        return res.map(entry => ({
            uid: entry.uid,
            gid: entry.gid,
            bid: entry.bid,
            priId: entry. pri_id,
            permit: entry.permit,
        }));
    } catch (err) {
        console.error('[Error][MySQL] check user privilege list failed', cmd)
        throw err;
    }
}

module.exports = {
    listGroup,
    addGroup,
    removeGroup,
    listPrivilege,
    addPrivilege,
    removePrivilege,
    listUserToGroup,
    addUserToGroup,
    removeUserFromGroup,
    listPrivilegeToGroup,
    addPrivilegeToGroup,
    removePrivilegeFromGroup,
    checkUserPrivilegeList,
};
