const mysql = require('mysql');
const conf = require('../../readConfig');

const pool = mysql.createPool({
	connectionLimit: conf.mysql.maxConnection,
	host: conf.mysql.host,
	port: conf.mysql.port,
	user: conf.mysql.username,
	password: conf.mysql.password,
	database: conf.mysql.db,
	debug: conf.mysql.debugPool,
});


// use it like this
/*
	const con = await getConnectionPromise().catch(err => { console.log(err); }); 
	// if error occured con is undefined;
	if(con === undefined) {
		// exit routine and send error message to other parts.
	}
*/
function getConnectionPromise() {
	return new Promise(function(res,rej) {
		pool.getConnection(function(err,connection) {
			if(err) {
				rej(err);
				return;
			}
			// you can set triggers here
			// connection.on('error', function(err) {});
			res(connection);
			// You must use releaseConnection(connection) after finishing your work.
		});
	});
}

function releaseConnection(connection) {
	connection.release();
}

async function wrap(callback) {
	const con = await getConnectionPromise().catch(err => { console.log(err); });
	if(con === undefined) {
		console.log('[Error][MySQL][Connection] connect failed.');
		return Promise.reject();
	}

}

module.exports = {
	getConnectionPromise: getConnectionPromise,
	releaseConnection: releaseConnection,
	release: releaseConnection,
	wrap: wrap,
}
