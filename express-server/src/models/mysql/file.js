const pool = require('./db');

async function getAddress(fileId) {
    var con;
    try {
        con = await pool.aGet();
        var command = 'select `id`, `name`, `path` from `file` where `id`=' + con.escape(fileId) + ';';
        var res = await pool.aQuery(con, command);
        return res[0];
    } catch (err) {
        console.error('[Error][MySQL] Get File Address failed');
    } finally {
        pool.release(con);
    }
}

module.exports = {
    getAddress
};