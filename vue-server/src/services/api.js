import axios from 'axios';
import conf from '@/../config.json';

export default(prefix) => {
	var host = document.baseURI.substr(document.baseURI.indexOf('://') + 3);
	host = host.substring(0, host.indexOf('/'));
	var protocol = document.baseURI.substr(0, document.baseURI.indexOf('://')) + '://';
	var apiAddress = 
		protocol
		+ host + '/'
		+ conf.apiServer.prefix;
	if(prefix) {
		apiAddress += prefix;
	}
	return axios.create({
		baseURL: apiAddress
	});
};

