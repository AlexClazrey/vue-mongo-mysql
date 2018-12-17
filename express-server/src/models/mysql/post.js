const pool = require('./db');

// no return 
async function addPostToBoard(pid, bid) {
	var con;
	try {
		con = await pool.aGet();
		await pool.aQuery(con, 'call add_post_to_board(' + con.escape(pid) + ', ' + con.escape(bid) + ');');
	} catch(err) {
		console.error('[Error][MySQL] add post to board error', pid, bid);
	} finally {
		pool.release(con);
	}
}

// return 1 success or 0 failed
async function addPostToReply(cPid, pPid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'call add_post_to_reply(' + con.escape(cPid) + ', ' + con.escape(pPid) + ', @res);';
		await pool.aQuery(con, cmd);
		var res = await pool.aQuery(con, 'select @res');
		return res[0]['@res'];
	} catch(err) {
		console.error('[Error][MySQL] add post to reply error', cmd);
	} finally {
		pool.release(con);
	}
}



module.exports = {
	addPost,
};