import api from '@/services/api'

var ax = api('/posts');
export default {
	fetchPosts(params) {
		return ax.get('?bid=' + params);
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

