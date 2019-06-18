<template lang="pug">
v-card(flat)
    v-card(flat v-if='!loading')
        simple-post-card(v-for="post in posts.filter(it=>!it.deleted)" :key="post.pid" :post="post")
        v-card.mx-4.my-3(flat v-if="posts.length == 0 && !failed && !loading")
            p.headline You haven't posted anything or all your posts have been deleted.
        v-card.mx-4.my-3(flat v-if="loading")
            p.headline Loading...
</template>

<script>
import SPC from './SimplePostCard.vue'
import userApi from '@/services/user';
import $ from 'jquery';
require('jquery.cookie');

export default {
    components: {
        'simple-post-card': SPC,
    },
    data() {
        return {
            loading: false,
            failed: false,
            posts: [],
        }
    },
    computed: {
        uid() {
            return $.cookie('uid');
        }
    },
    created() {
        this.fetchPosts();        
    },
    methods: {
        async fetchPosts() {
            this.loading = true;
            var res = await userApi.getUserPosts(this.uid);
            this.loading = false;
            if(res.data.success) {
                this.posts = res.data.data;
            } else {
                alert('获取帖子数据失败.');
                this.failed = true;
            }
        },
    }
}
</script>
