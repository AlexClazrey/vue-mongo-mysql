<template lang="pug">
v-card(flat)
    v-card(flat v-if='!loading')
        simple-post-card(v-for="post in posts" :key="post.pid" :post="post")
        v-card.mx-4.my-3(flat v-if="posts.length == 0")
            p.headline No favorites here.
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
            var res = await userApi.getUserFavorites(this.uid);
            this.loading = false;
            if(res.data.success) {
                this.posts = res.data.data;
            } else {
                alert('获取收藏数据失败.');
            }
        },
    }
}
</script>
