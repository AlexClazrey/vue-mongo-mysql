const pool = require('./db');
const cook = require('./cookies');

// 记得要及时释放连接

// returns int uid or null
async function userLogin(username,password) {
	var con;
	try {
		con = await pool.aGet();
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

async function userRegister(username,nickname,password,email) {
	var con;
	try {
		con = await pool.aGet();
		var salt = pool.randStr();
		var cmd = 'call user_register('
			+ con.escape(username)+', '
			+ con.escape(nickname)+','
			+ con.escape(password)+',' 
			+ con.escape(salt) + ','
			+ con.escape(email)+', @uid);';
		await pool.aQuery(con, cmd);
		res = await pool.aQuery(con, 'select @uid;');
		if(res.length > 0 && res[0]['@uid'] > 0) {
			return res[0]['@uid']; // Register success
		} else {
			return null; // Register failed
		}
	} catch (err) {
		console.error('[Error][MySQL] register failed.', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

//return user info or null;
async function getUserInfo(uid) {
	var con;
	try {
		con = await pool.aGet();
		var res = await pool.aQuery(con, 'select id as uid, username, nickname, email, portrait from user where id='+con.escape(uid));
		if(res.length > 0)
			return res[0];
		else
			return null;
	} catch (err) {
		console.error('[Error][MySQL] getuserinfo failed.', uid);
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
		var cookies = await cook.add(uid, ip);
		return {
			uid,
			cookies
		};
	} else {
		return null;
	}
}

async function registerAndCookies(username, nickname, password, email, ip) {
	var uid = await userRegister(username,nickname,password,email);
	// check if failed uid will be null
	if(uid) {
		var cookies = await cook.add(uid, ip);
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
	loginAndCookies,
	getUserInfo,
	userRegister,
	registerAndCookies,
}