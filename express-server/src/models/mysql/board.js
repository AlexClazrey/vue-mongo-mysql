const pool = require('./db');

async function boardList() {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'select id, name from board;'
        var res = await pool.aQuery(con, cmd);
        return res;
    } catch (err) {
        console.error('[Error][MySQL] list board error');
        throw err;
    } finally {
        pool.release(con);
    }
}

async function addBoard(name) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call add_board(' + con.escape(name) + ', @res);';
        await pool.aQuery(con, cmd);
        var res = await pool.aQuery(con, 'select @res;');
        return res[0]['@res'];
    } catch (err) {
        console.error('[Error][MySQL] add board error');
        throw err;
    } finally {
        pool.release(con);
    }
}

async function removeBoard(bid) {
    var con;
    try {
        con = await pool.aGet();
        var cmd = 'call delete_board(' + con.escape(bid) + ');';
        await pool.aQuery(con, cmd);
    } catch (err) {
        console.error('[Error][MySQL] remove board error');
        throw err;
    } finally {
        pool.release(con);
    }
}

module.exports = {
    list: boardList,
    add: addBoard,
    remove: removeBoard,
}