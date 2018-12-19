import api from '@/services/api'

export default {
	// 这里面await的结构和各种可能失败的细节我还不清楚
	fetchPosts(params) {
		return api().get('/posts?bid=' + params);
	},
	addPost(params) {
		return api().post('posts/draft', params);
	},
	getPost(params) {
		return api().get('posts/' + params.id);
	},
	updatePost(params) {
		return api().put('posts/' + params.id, params);
	},
	deletePost(params) {
		return api().delete('posts/' + params.id);
	}
};

