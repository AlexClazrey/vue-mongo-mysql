const pool = require('./db');

async function boardList() {
    var con;
    try{
        con = await pool.aGet();
        var cmd = 'select id as bid, name from board;'
        var res = await pool.aQuery(con, cmd);
        return res;
    } catch(err) {
        console.error('[Error][MySQL] list board error');
        throw err;
    } finally {
        pool.release(con);
    }
}

module.exports = {
    list: boardList,
}