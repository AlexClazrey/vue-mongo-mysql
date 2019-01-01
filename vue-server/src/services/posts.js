import api from '@/services/api'

var ax = api('/posts');
export default {
	fetchPosts(bid, page) {
		var query = bid ? ('?bid=' + bid + '&') : '?';
		query += page ? ('page=' + page) : '';
		return ax.get(query);
	},
	saveDraft(params) {
		return ax.post('/draft', params);
	},
	commitPost(params) {
		return ax.post('/', params);
	},
	getPost(pid) {
		return ax.get('/' + pid);
	},
	deletePost(pid) {
		return ax.delete('/' + pid);
	}
};

