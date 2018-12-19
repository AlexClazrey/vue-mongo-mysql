<template>
	<PostEditor heading="Add Post" :post="{title: '', content: '', isReply: false, bid: board_id}" buttonText="Add" :loading="false" @emit="addPost">
	</PostEditor>
</template>

<script>
	import PostsService from '@/services/posts';
	import PostEditor from './PostEditor.vue';
	export default {
		name: 'NewPost',
		data(){
			return {
				board_id: null
			}
		},
		components: {
			'PostEditor': PostEditor
		},
		created() {
			this.board_id = this.$route.params.id;
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
