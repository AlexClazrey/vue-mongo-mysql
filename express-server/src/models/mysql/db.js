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
	return new Promise(function (res, rej) {
		pool.getConnection(function (err, connection) {
			if (err) {
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
	if (connection === undefined) {
		console.log("[Info][MySQL] release an undefined connection");
		return;
	}
	releaseConnection(connection);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function aQueryWithLog(connection, ...queryArgs) {
	if (connection === undefined) {
		console.error("[Error][MySQL] query via an undefined connection");
		throw new Error("[MySQL] query via an undefined connection");
	}
	console.log('[Info][Query]', ...queryArgs);
	try {
		const result = await util.promisify(connection.query.bind(connection))(...queryArgs);
		return result;
	} catch (err) {
		// if deadlock, retry it for 3 times, interval 100ms.
		if (err.message.includes('ER_LOCK_DEADLOCK')) {
			var retryResult;
			for (var retryCount = 0; retryCount < 3; retryCount++) {
				// 随机沉睡50-150ms
				var period = Math.floor(Math.random() * (150 - 50) + 50);
				await sleep(period);
				console.log('[Warn][MySQL] Deadlock >> retrying #' + retryCount);
				retryResult = await aQueryRetry(connection, queryArgs);
				// console.log('[Info][MySQL] Deadlock retry result', retryResult);
				if (retryResult == -1)
					break;
				else if (retryResult == 0)
					continue;
				else
					return retryResult;
			}
			console.log("[Error][MySQL] query deadlock retry timeout failed.");
		}
		console.error("[Error][MySQL] query failed. QueryArgs:", queryArgs, err);
		throw err;
	}
}

async function aQueryRetry(connection, queryArray) {
	try {
		return await util.promisify(connection.query.bind(connection))(...queryArray);
	} catch (err) {
		if (err.message.includes('ER_LOCK_DEADLOCK'))
			return 0;
		else
			return -1;
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