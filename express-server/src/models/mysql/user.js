const pool = require('./db');

// 记得要及时释放连接

// returns int uid or null
async function userLogin(username,password) {
	var con;
	try {
		con = await pool.aGet();
		// 一个AQUERY只能写一句SQL ！！！
		await pool.aQuery(con, 'call user_login('+con.escape(username)+', '+con.escape(password)+', @uid);');
		res = await pool.aQuery(con, 'select @uid;');
		// by a "console.log(res)" test now I know the format of res is [{ '@uid' : 1 }]  if failed is [{ '@uid' : null }]
		if(res.length > 0 && res[0]['@uid'] > 0) {
			return res[0]['@uid']; // login success
		} else {
			return null; // login failed
		}
	} catch (err) {
		console.error('[Error][MySQL] login failed.', username, password);
		throw err;
	} finally {
		pool.release(con);
	}
}

async function userRegister(username,nickname,password,email,portrait) {
	var con;
	try {
		con = await pool.aGet();
		await pool.aQuery(con, 'call user_register('+con.escape(username)+', '+con.escape(nickname)+','+con.escape(password)+','+con.escape(emali)+','+con.escape(portrait)+', @uid);');
		res = await pool.aQuery(con, 'select @uid;');
		if(res.length > 0 && res[0]['@uid'] > 0) {
			return res[0]['@uid']; // login success
		} else {
			return null; // login failed
		}
	} catch (err) {
		console.error('[Error][MySQL] register failed.', username,nickname,password,email,portrait);
		throw err;
	} finally {
		pool.release(con);
	}
}

//return userinfo
async function getuserinfo(uid) {
	var con;
	try {
		con = await pool.aGet();
		await pool.aQuery(con, 'select username,nickname,password,email,portrait from user where id='+con.escape(uid));
	} catch (err) {
		console.error('[Error][MySQL] getuserinfo failed.', uid);
		throw err;
	} finally {
		pool.release(con);
	}
}

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

// returns { uid: uid, cookies: cookies } or null
async function loginAndCookies(username, password, ip) {
	var uid = await userLogin(username, password);
	// check if failed uid will be null
	if(uid) {
		var cookies = await addCookies(uid, ip);
		return {
			uid,
			cookies
		};
	} else {
		return null;
	}
}

async function registerAndCookies(username, password, ip) {
	var uid = await userRegister(username,nickname,password,email,portrait);
	// check if failed uid will be null
	if(uid) {
		var cookies = await addCookies(uid, ip);
		return {
			uid,
			cookies
		};
	} else {
		return null;
	}
}

module.exports = {
	userLogin,
	addCookies,
	loginAndCookies,
	getuserinfo,
	userRegister,
	registerAndCookies,
}