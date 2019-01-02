<template lang="pug">
    v-card.amber.lighten-5.pa-4(flat)
        v-layout.py-4.justify-center(raw wrap)
            v-flex(xs12 md2 lg1)
                v-avatar()
                    img(v-if="user.portrait")
                    v-icon(v-else large) person
            v-flex(xs12 md2)
                v-card-text.my-0.py-0
                    p.my-0.display-1 {{ user.nickname + ' #' + user.id }}
        v-layout.mt-4.justify-center(raw wrap)
            v-flex(xs12 md9 v-if="!postsLoading")
                v-card(v-for="post in posts" :key="post.pid")
                    simple-post-card(:post="post")
                v-card.transparent.px-4.py-3(flat v-if="posts.length == 0")
                    p.title No post here.
            v-flex(xs12 md9 v-else)
                v-card.transparent.px-4.py-3(flat)
                    p.title Loading posts...
</template>

<script>
import SimplePostCard from '@/components/user-space/SimplePostCard.vue';
import UserApi from '@/services/user';

export default {
    props: {
        uid: {
            default: null,
        }
    },
    components:{
        'simple-post-card' : SimplePostCard
    },
    data(){
        return{
            postsLoading: true,
            userLoading: true,
            posts: {},
            user: {},
            readingPost: {
                type: Boolean,
                default: true
            }
        }
    },
    created(){
        this.getPostsByid(this.uid);
        this.getUserInfo(this.uid);
    },
    methods:{
        async getPostsByid(uid){
            this.postsLoading = true;
            if(uid != null){
                const res = await UserApi.getUserPosts(uid);
                if(res.data.success){
                    this.posts = res.data.data;
                    this.postsLoading = false;
                } else {
                    window.alert('get user posts failed');
                }
            }
        },
        async getUserInfo(uid) {
            this.userLoading = true;
            const res = await UserApi.getInfo(uid);
            if(res.data.success) {
                this.user = res.data.data;
                this.userLoading = false;
            } else {
                window.alert('get user info failed');
            }
        }
    }
}
</script>
