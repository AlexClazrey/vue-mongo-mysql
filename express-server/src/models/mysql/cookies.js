const pool = require('./db');

// return cookies;
async function addCookies(uid, ip) {
	var con;
	try {
		con = await pool.aGet();
		// generate random string
		// 可能有个小隐患就是随机字符串会碰撞，不过暂且不用管
		var cookies = pool.randStr();
		var cmd = 'call add_cookies('
			 + con.escape(uid) + ', '
			 + con.escape(ip) + ', '
			 + con.escape(cookies) + ');'
		await pool.aQuery(con, cmd);
		return cookies;
	} catch (err) {
		console.error('[Error][MySQL] add cookies failed', uid, ip);
		throw err;
	} finally {
		pool.release(con);
	}
}

// 更新cookies最后使用时间
// returns 0 or 1
async function updateCookies(uid, cookies) {
    var con;
    try {
        con = await pool.aGet();
        await pool.aQuery(con, 'call update_cookies(' + con.escape(uid) + ', ' + con.escape(cookies) + ', @res);');
        var res = await pool.aQuery(con, 'select @res;');
        return res[0]['@res'];
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
    add: addCookies,
    update: updateCookies,
    check: checkCookies,
    delete: deleteCookies,
};