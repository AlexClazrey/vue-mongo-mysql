<template>
	<div class="post-editor">
		<h1>{{ heading }}</h1>
		<div class="form">
			<div>
				<input type="text" name="title" :placeholder="loading ? 'Loading..' : 'Title'" v-model="post.title" />
			</div>
			<div>
				<textarea rows="15" cols="15" :placeholder="loading ? 'Loading...' : 'Description'" v-model="post.description">
				</textarea>
			</div>
			<div>
				<button class="app_post_btn" @click="emitPost">{{ buttonText }}</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'NewPost',
		props: {
			heading: String,
			post: { title: String, description: String },
			buttonText: String,
			loading: Boolean
		},
		methods: {
			emitPost: function() {
				this.$emit('emit', this.post);
			}
		}
	}
</script>

<style type="text/css">
.form input, .form textarea {
	width: 500px;
	padding: 10px;
	border: 1px solid #e0dede;
	outline: none;
	font-size: 12px;
	font-family: monospace;
}
.form div {
	margin: 20px;
}
.app_post_btn {
	background: #4d7ef7;
	color: #fff;
	padding: 10px 80px;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: bold;
	width: 520px;
	border: none;
	cursor: pointer;
}
</style>