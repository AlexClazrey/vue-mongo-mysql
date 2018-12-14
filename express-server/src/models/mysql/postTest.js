
const pool = require('./db');

// 记得要及时释放连接

async function getList() {
	try {
		const con = await pool.aGet();
		const result = await util.promisify(con.query.bind(con))('select id, title, description from posttest limit 0,20;');
		return result;
	} catch (err) {
		console.log(err);
	} finally {
		pool.release(con);
	}
}




module.exports = {
	getList,
};