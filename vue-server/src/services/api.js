import axios from 'axios';
import conf from '@/../config.json';

export default(prefix) => {
	var apiAddress = 
		conf.apiServer.protocol
		+ conf.webServer.host + ":" + conf.webServer.port
		+ conf.apiServer.prefix;
	if(prefix) {
		apiAddress += prefix;
	}
	return axios.create({
		baseURL: apiAddress
	});
};

