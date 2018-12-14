import axios from 'axios';
import conf from '@/../config.json';

export default() => {
	return axios.create({
		baseURL: conf.apiServer.address
	});
};

