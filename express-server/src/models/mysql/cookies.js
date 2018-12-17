const pool = require('./db');

// 更新cookies最后使用时间
// no return
async function updateCookies(uid, cookies) {
    var con;
    try {
        con = await pool.aGet();
        await pool.aQuery(con, 'call update_cookies(' + con.escape(uid) + ', ' + con.escape(cookies) + ');');
    } catch(err) {
        console.error('[Error][MySQL] update cookies failed', uid, cookies);
    } finally {
        pool.release(con);
    }
}

// 删除cookies
// no return 
async function deleteCookies(cookies) {
    var con;
    try {
        con = await pool.aGet();
        await pool.aQuery(con, 'call delete_cookies(' + con.escape(cookies) + ');');
    } catch (err) {
        console.error('[Error][MySQL] delete cookies failed', cookies);
    } finally {
        pool.release(con);
    }
}

// 测试cookies
// returns 1 or 0
async function checkCookies(uid, cookies) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call check_cookies(' + con.escape(uid) + ', ' + con.escape(cookies) + ', @res);';
        console.log(cmd);
        await pool.aQuery(con, cmd);
        var res = await pool.aQuery(con, 'select @res;');
        return res[0]['@res'];
    } catch (err) {
        console.error('[Error][MySQL] check cookies failed', uid, cookies);
    } finally {
        pool.release(con);
    }
}

module.exports = {
    update: updateCookies,
    check: checkCookies,
    delete: deleteCookies,
};