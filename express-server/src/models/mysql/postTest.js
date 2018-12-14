
const pool = require('./db');

// 记得要及时释放连接

async function getList() {
	var con;
	try {
		con = await pool.aGet();
		return await pool.aQuery(con, 'select id, title, description from posttest limit 0,20;');
	} catch (err) {
		console.log(err);
	} finally {
		pool.release(con);
	}
}

async function addPost(title, description) {
	var con;
	try {
		
	} catch (err) {
		console.log(err);
	} finally {
		pool.release(con);
	}
}


module.exports = {
	getList,
};