const util = require('util');
const pool = require('./db');

// 记得要及时释放连接

async function getList() {
	const con = await pool.getConnectionPromise().catch(err => { console.log(err); });
	if(con === undefined) {
		console.log('[Error][MySQL][Connection] connect failed.');
		return Promise.reject();
	}
	const result = await util.promisify(con.query.bind(con))('select id, title, description from posttest limit 0,20;')
		.catch(err => {console.log(err);});
	pool.release(con);  // 一定要放在下面一个return之前。
	if(result === undefined) {
		console.log('[Error][MySQL][Query] getList failed.');
		return Promise.reject();
	}
	return result;
}



module.exports = {
	getList,
};