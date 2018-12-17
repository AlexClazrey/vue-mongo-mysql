
const pool = require('./db');

// 记得要及时释放连接

async function getUseridlist() {
	var con;
	try {
		con = await pool.aGet();
		return await pool.aQuery(con, 'select id from user;');
	} catch (err) {
		console.error('[Error][MySQL] getList error.')
		throw err;
	} finally {
		pool.release(con);
	}
}

async function getPassword(id) {
	var con;
	try {
		con = await pool.aGet();
		return await pool.aQuery(con, 'select password from user where id=' + con.escape(id));
	} catch (err) {
		console.error('[Error][MySQL] getPassword error.')
		throw err;
	} finally {
		pool.release(con);
	}
}

async function Userlogin(username,password) {
	var con;
	try {
		con = await pool.aGet();
		return await pool.aQuery(con, 'call user_login('+con.escape(username)+','+con.escape(password)+',@uid;select @uid);');
	} catch (err) {
		console.error('[Error][MySQL] id does not exsit.')
		throw err;
	} finally {
		pool.release(con);
	}
}

async function removePost(id) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = "delete from posttest where id=" + con.escape(id) + ';';
		return await pool.aQuery(con, cmd);
	} catch (err) {
		console.error('[Error][MySQL] removePost error.')
		throw err;
	} finally {
		pool.release(con);
	}
}

async function updatePost(id, title, description) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = "update posttest set title=" + con.escape(title)
			+ ", description=" + con.escape(description)
			+ " where id=" + con.escape(id);
		return await pool.aQuery(con, cmd);
	} catch (err) {
		console.error('[Error][MySQL] updatePost error.')
		throw err;
	} finally {
		pool.release(con);
	}
}

module.exports = {
	getUseridlist,
	getPassword,
	Userlogin,
	removePost,
	updatePost,
};