const mysql = require('mysql');
const util = require('util');
const crypto = require("crypto");
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
	const con;
	try {
		con = await aGetConnectionWithLog();
		// do your work...
	} catch (err) {
		console.error(err);
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
	console.log('[Info][Query]', ...queryArgs);
	try {
		const result = await util.promisify(connection.query.bind(connection))(...queryArgs);
		return result;
	} catch (err) {
		console.error("[Error][MySQL] query failed. QueryArgs: \n", queryArgs);
		throw err;
	}
}

function makeRandomString() {
 	return crypto.randomBytes(20).toString('hex');
}

module.exports = {
	getConnectionPromise: getConnectionPromise,
	releaseConnection: releaseConnection,
	release: releaseConnectionWithLog,
	aGet: aGetConnectionWithLog,
	aQuery: aQueryWithLog,
	randStr: makeRandomString,
}
