<template>
	<PostEditor heading="Add Post" :post="{title: '', description: ''}" buttonText="Add" :loading="false" @emit="addPost">
	</PostEditor>
</template>

<script>
	import PostsService from '@/services/posts';
	import PostEditor from './PostEditor.vue';
	export default {
		name: 'NewPost',
		components: {
			'PostEditor': PostEditor
		},
		methods: {
			async addPost(data) {
				const response = await PostsService.addPost(data);
				if(response.data.success) {
					this.$router.push({name: 'posts'});
				} else {
					window.alert('Add post failed');
				}
			}
		}
	}
</script>
