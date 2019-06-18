const pool = require('./db');

// no return 
async function addPostToBoard(pid, bid, changeBoard) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = changeBoard ? 'call change_post_to_board(' : 'call add_post_to_board(';
		cmd += con.escape(pid) + ', ' + con.escape(bid) + ');';
		await pool.aQuery(con, cmd);
	} catch(err) {
		console.error('[Error][MySQL] add post to board error', pid, bid);
		throw err;
	} finally {
		pool.release(con);
	}
}

// return 1 success or 0 failed
async function addPostToReply(cPid, pPid, changeParent) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = changeParent ? 'call change_post_to_reply(' : 'call add_post_to_reply(';
		cmd += con.escape(cPid) + ', ' + con.escape(pPid) + ', @res);';
		await pool.aQuery(con, cmd);
		var res = await pool.aQuery(con, 'select @res;');
		return res[0]['@res'];
	} catch(err) {
		console.error('[Error][MySQL] add post to reply error', cmd);
		throw err;
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
		await pool.aQuery(con, cmd);
		var res = await pool.aQuery(con, 'select @pid;');
		return res[0]['@pid'];
	} catch (err) {
		console.error('[Error][MySQL] save post failed', cmd);
		throw err;
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
		throw err;
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
		var cmd = 'select * from v_ubp_list';
		if(bid) {
			cmd += ' where bid=' + con.escape(bid);
		}
		page = page > 0 ? page : 1;
		cmd += ' limit ' + con.escape((page - 1) * pageSize) + ', ' + con.escape(pageSize) + ';';
		var res = await pool.aQuery(con, cmd);
		return res;
	} catch (err) {
		console.error('[Error][MySQL] get list failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

// 
async function getRepliesCount(pid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'select count(*) as cnt from `reply` join `commit_post` on `reply`.`child_id`= `commit_post`.`post_id`'
			+ ' where parent_id=' + con.escape(pid) + ';';
		var res = await pool.aQuery(con, cmd);
		return res[0]['cnt'];
	} catch (err) {
		console.error('[Error][MySQL] get replies count failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

// 在foreach里面不能用async她不会等你，这个操作要用Promise.all来实现
async function getListAndReplies(bid, page) {
	var postList = await getList(bid, page);
	var repliesPromises = postList.map(post => {
		return getReplies(post.pid, 0, 5, true);
	});
	var repliesCountPromises = postList.map(post => {
		return getRepliesCount(post.pid);
	});
	var allReplies = Promise.all(repliesPromises).then(values => {
		values.forEach((reply, index) => {
			postList[index].replies = reply;
		});
	});
	var allCounts = Promise.all(repliesCountPromises).then(values => {
		values.forEach((count, index) => {
			postList[index].repliesCount = count;
		})
	});
	await Promise.all([allReplies, allCounts]);
	return postList;
}

// post infos
async function getCommitedPost(pid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'select * from v_ubp_list where pid =' + con.escape(pid) + ';';
		var res = await pool.aQuery(con, cmd);
		return res[0];
	} catch (err) {
		console.error('[Error][MySQL] get commited post detail failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

// post content
async function getPostContent(pid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'select * from v_post_content where pid=' + con.escape(pid) + ';';
		var res = await pool.aQuery(con, cmd);
		return res[0];
	} catch (err) {
		console.error('[Error][MySQL] get post content failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

async function getReplies(pid, offset, count, descending) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 
			`select * from v_post_reply_list where p_pid = ${con.escape(pid)} order by \`commit_time\` ${descending ? 'desc' : 'asc'} limit ${con.escape(offset)}, ${con.escape(count)};`;
		var res = await pool.aQuery(con, cmd);
		return res;
	} catch (err) {
		console.error('[Error][MySQL] get replies list failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

// returns bid
async function getPostBoard(pid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'call get_post_board(' + con.escape(pid) + ', @res);';
		await pool.aQuery(con, cmd);
		var res = await pool.aQuery(con, 'select @res;');
		return res[0]['@res'];
	} catch (err) {
		console.error('[Error][MySQL] get post board failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

async function addFavPost(pid, uid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'call add_fav_post(' + con.escape(pid) + ',' + con.escape(uid) + ');';
		await pool.aQuery(con, cmd);
	} catch (err) {
		console.error('[Error][MySQL] add fav post failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

async function removeFavPost(pid, uid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'call delete_fav_post(' + con.escape(pid) + ',' + con.escape(uid) + ');';
		await pool.aQuery(con, cmd);
	} catch (err) {
		console.error('[Error][MySQL] remove fav post failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

async function userRemovePost(pid) {
	var con;
	try {
		con = await pool.aGet();
		var cmd = 'call delete_post_user(' + con.escape(pid) + ')';
		await pool.aQuery(con, cmd);
	} catch (err) {
		console.error('[Error][MySQL] remove post failed', cmd);
		throw err;
	} finally {
		pool.release(con);
	}
}

async function searchPost(keyword) {
        var con;
        try {
                con = await pool.aGet();
                // 把 % 放在这个输入里面，escape的作用是防止它和外界的SQL交互。
				var cmd = 'select post.id as pid, v_post_relation.p_pid as p_pid, '
					+ 'user.id as uid, user.username as nickname, '
					+ 'post_content.title as title, '
					+ 'post_content.content as content, '
					+ 'commit_post.time as commit_time, '
					+ 'post.hot as hot, post.hits as hits '
					+ 'from post join v_post_relation join post_content join commit_post join user '
					+ 'where post.id = v_post_relation.pid and user_id = user.id and commit_post.post_id = post.id and post_content.post_id=post.id and post.deleted=0 '
					+ 'and (post_content.content like + ' + con.escape('%'+keyword+'%') + ' or post_content.title like + ' + con.escape('%'+keyword+'%') + ');';
                var res = await pool.aQuery(con, cmd);
                return res;
        } catch (err) {
                console.error('[Error][MySQL] search error', cmd);
                throw err;
        } finally {
                pool.release(con);
        }
}

module.exports = {
	addPostToBoard,
	addPostToReply,
	saveDraft,
	commitPost,
	getList,
	getListAndReplies,
	getCommitedPost,
	getPostContent,
	getReplies,
	getPostBoard,
	getRepliesCount,
	addFavPost,
	removeFavPost,
	searchPost,
	userRemovePost,
};
