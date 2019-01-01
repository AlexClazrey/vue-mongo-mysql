import api from '@/services/api'

var ax = api('/posts');
export default {
	fetchPosts(bid, page) {
		var query = bid ? ('?bid=' + bid + '&') : '?';
		query += page ? ('page=' + page) : '';
		return ax.get(query);
	},
	addPost(params) {
		return ax.post('/draft', params);
	},
	getPost(params) {
		return ax.get('/' + params.id);
	},
	deletePost(params) {
		return ax.delete('/' + params.id);
	}
};

