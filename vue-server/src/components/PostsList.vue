<template>
	<div class="posts-list">
		<h1>Posts</h1>
		<div>
			<p v-if="!hasPost">There are no posts.. Lets add one now.</p>
			<div class="add-post-wrapper">
				<router-link :to="{ name: 'newPost' , params:{ id : board_id }}" :class="{add_post_link: !hasPost}">
					Add Post
				</router-link>
			</div>
		</div>
		<div v-if="hasPost" class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th width="450">Description</th>
						<th width="100">LastReplyTime</th>
						<th width="100" class="post-action-cell">Action</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="post in posts" :key="post.pid">
						<td>{{ post.title }}</td>
						<td>{{ post.content }}</td>
						<td>{{ post.last_reply_time }}</td>
						<td class="post-action-cell">
							<router-link :to="{name:'editPost', params:{id: post.pid}}">Edit</router-link>
							| <a href="#" @click="deletePost( post.pid, post.title)">Delete</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import PostsService from '@/services/posts';
export default {
	name: 'posts',
	data() {
		return {
			board_id: null,
			posts: [],
			loading: true
		}
	},
	computed: {
		hasPost: function() {
			return this.loading || this.posts.length > 0;
		}
	},
	mounted() {
		this.board_id = this.$route.params.id;
		this.getPosts(this.board_id);
		// console.log(this.board_id);
	},
	methods: {
		async getPosts(params) {
			const response = await PostsService.fetchPosts(params);
			// there is a loading scene, not displaying no posts...
			// 这里面还有很多多人在线的话同步刷新的坑
			// console.log(response);
			this.loading = false;
			if(response.data.success) {
				this.posts = response.data.data;
			} else {
				window.alert("Fetch posts list failed.");
			}
		},
		async deletePost(id, name) {
			const answer = confirm("Do you want to delete this post \"" + name + "\"?");
			if(answer) {
				const response = await PostsService.deletePost({id: id});
				if(response.data.success) {
					// window.alert("Delete success.")
					this.getPosts();
				} else {
					window.alert("Delete post failed.");
				}
			}
		}
	}
};
</script>

<style type="text/css" scoped>
table {
	margin: 0 auto;
	text-align: center;
	font-family: monospace;
}
tbody tr:nth-child(even) {
	background: #f2f2f2;
}
td, th {
	text-align: left;
	padding: 10px;
}
th {
	background: #4d7ef7;
	color: #fff;
	font-size: 16px;
}
.post-action-cell {
	text-align: center;
}
.add-post-wrapper {
	margin: 10px;
}
a {
	color: #4d7ef7;
	text-decoration: none;
}
a.add_post_link {
	background: #4d7ef7;
	color: #fff;
	padding: 10px 80px;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: bold;
}
</style>