import axios from 'axios';
import conf from '@/../config.json';

export default() => {
	var apiAddress = 
		conf.apiServer.protocol
		 + conf.webServer.host + ":" + conf.webServer.port
		 + conf.apiServer.prefix;
	return axios.create({
		baseURL: apiAddress
	});
};

