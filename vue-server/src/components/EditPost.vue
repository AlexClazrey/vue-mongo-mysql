<template>
	<PostEditor heading="Edit Post" :post="post" buttonText="update" :loading="loading" @emit="updatePost">
	</PostEditor>
</template>

<script>
	import PostsService from '@/services/posts';
	import PostEditor from './PostEditor.vue';
	export default {
		name: 'EditPost',
		components: {
			'PostEditor': PostEditor
		},
		data() {
			return { 
				id: null,
				post: {
				},
				loading: true
			};
		},
		mounted() {
			this.id = this.$route.params.id;
			this.getPost();
		},
		methods: {
			// 这里的两个Object Assign是让下面的代码不依赖数据库的Schema的关键
			async getPost() {
				const response = await PostsService.getPost({
					id: this.id
				});
				this.loading = false;
				if(response.data.success) {
					Object.assign(this.post, response.data.post);
				} else {
					alert('Retrieve post content failed.');
				}
			},
			async updatePost(data) {
				Object.assign(this.post, data);
				this.post.id = this.id;
				const response = await PostsService.updatePost(this.post);
				if(response.data.success) {
					this.$router.push({name: 'posts'});
				} else {
					alert('Submit content failed.');
				}
			},
		}
	}
</script>