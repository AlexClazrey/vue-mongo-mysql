const mysql = require('mysql');
const util = require('util');
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


// You should not put anything after resolve in Promise to avoid mysterious bug.

function getConnectionPromise() {
	return new Promise(function(res,rej) {
		pool.getConnection(function(err,connection) {
			if(err) {
				rej(err);
			} else {
				// you can set triggers here
				// connection.on('error', function(err) {});
				res(connection);
				// You must use releaseConnection(connection) after finishing your work.
			}
		});
	});
}

function releaseConnection(connection) {
	connection.release();
}

// use it like this
/*
	try {
		const con = await aGetConnectionWithLog();
	} catch (err) {
		console.log(err);
	} finally {
		releaseConnectionWithLog(con);
	}
*/
async function aGetConnectionWithLog() {
	try {
		return await getConnectionPromise();
	} catch (err) {
		console.error('[Error][MySQL][Connection] connect failed.');
		throw err;
	}
}

function releaseConnectionWithLog(connection) {
	if(connection === undefined) {
		console.log("[Info][MySQL] release an undefined connection");
		return;
	}
	releaseConnection(connection);
}

async function aQueryWithLog(connection, ...queryArgs) {
	if(connection === undefined) {
		console.error("[Error][MySQL] query via an undefined connection");
		throw new Error("[MySQL] query via an undefined connection");
	}
	try {
		const result = util.promisify(connection.query.bind(connection))(...queryArgs);
		return result;
	} catch (err) {
		console.error("[Error][MySQL] query failed.");
		throw err;
	}
}

module.exports = {
	getConnectionPromise: getConnectionPromise,
	releaseConnection: releaseConnection,
	release: releaseConnectionWithLog,
	aGet: aGetConnectionWithLog,
	aQuery: aQueryWithLog,
}
