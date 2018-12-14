import axios from 'axios';
import conf from '@/../config.js';
export default() => {
	return axios.create({
		baseURL: conf.apiServer.address
	});
};

