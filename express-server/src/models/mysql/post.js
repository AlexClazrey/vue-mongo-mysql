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
		var res = await pool.aQuery(con, 'select @res;');
		return res[0]['@res'];
	} catch(err) {
		console.error('[Error][MySQL] add post to reply error', cmd);
	} finally {
		pool.release(con);
	}
}

// input pid can be null for a new post
// return pid
async function saveDraft(uid, pid, title, content) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'call save_draft('
			 + con.escape(uid) + ', '
			 + con.escape(pid) + ', '
			 + con.escape(title) + ', '
			 + con.escape(content) + ', @pid);';
		console.log(cmd);
		await pool.aQuery(con, cmd);
		var res = await pool.aQuery(con, 'select @pid;');
		console.log(res);
		return res[0]['@pid'];
	} catch (err) {
		console.error('[Error][MySQL] save post failed', cmd);
	} finally {
		pool.release(con);
	}
}

// no return
async function commitPost(uid, pid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'call commit_post('
			 + con.escape(uid) + ', '
			 + con.escape(pid) + ');'
		await pool.aQuery(con, cmd);
	} catch (err) {
		console.error('[Error][MySQL] commit post failed', cmd);
	} finally {
		pool.release(con);
	}
}


// board can be null for all board
// page default to 1st page
var pageSize = 20;
async function getList(bid, page) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'select * from v_ubp_list_preview';
		if(bid) {
			cmd += ' where bid=' + con.escape(bid);
		}
		page = page > 0 ? page : 1;
		cmd += ' limit ' + con.escape((page - 1) * pageSize) + ', ' + con.escape(pageSize) + ';';
		// debug
		console.log(cmd);
		var res = await pool.aQuery(con, cmd);
		return res;
	} catch (err) {
		console.error('[Error][MySQL] get list failed', cmd);
	} finally {
		pool.release(con);
	}
}

module.exports = {
	addPostToBoard,
	addPostToReply,
	saveDraft,
	commitPost,
	getList
};