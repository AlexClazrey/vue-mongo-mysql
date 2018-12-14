import axios from 'axios';
var conf = require('@/../config.js');

export default() => {
	return axios.create({
		baseURL: conf.apiServer.address
	});
};

