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
	getPostContent(pid) {
		return ax.get('/content/' + pid);
	},
	getReplies(pid, page) {
		return ax.get('/reply-list/' + pid + '?page=' + page);
	},
	deletePost(pid) {
		return ax.delete('/' + pid);
	},
	addFav(pid) {
		return ax.post('/fav/' + pid);
	},
	removeFav(pid) {
		return ax.delete('/fav/' + pid);
	},
};

