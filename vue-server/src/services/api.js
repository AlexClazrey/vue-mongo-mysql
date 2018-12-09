import axios from 'axios';
import conf from '@/../config/config.js';
export default() => {
	return axios.create({
		baseURL: conf.webApi.address
	});
};

