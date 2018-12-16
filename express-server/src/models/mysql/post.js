
const pool = require('./db');

// 记得要及时释放连接

async function getPostlist() {
	var con;
	try {
		con = await pool.aGet();
		return await pool.aQuery(con, 'select id, title, description from post limit 0,20;');
	} catch (err) {
		console.error('[Error][MySQL] getList error.')
		throw err;
	} finally {
		pool.release(con);
	}
}

async function getPost(id) {
	var con;
	try {
		con = await pool.aGet();
		return await pool.aQuery(con, 'select id, title, description from posttest where id=' + con.escape(id));
	} catch (err) {
		console.error('[Error][MySQL] getPost error.')
		throw err;
	} finally {
		pool.release(con);
	}
}

async function addPost(title, description) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = "insert into posttest (title, description) values ";
		cmd += '(' + con.escape(title) + ',' + con.escape(description) + ');';
		return await pool.aQuery(con, cmd);
	} catch (err) {
		console.error('[Error][MySQL] addPost error.')
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
	getPostlist,
	getPost,
	addPost,
	removePost,
	updatePost,
};