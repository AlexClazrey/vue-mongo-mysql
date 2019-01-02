<template lang="pug">
    v-card.flat.pa-3()
        v-layout.justify-center(raw wrap)
            v-flex(xs12 md2)
                v-avatar()
                    img(src="")
            v-flex(xs12 md2)
                v-card-text.my-0.py-0
                    p.my-0.caption {{ IDdata }}
                    p.my-0.body-2 {{ nickname }}
        v-layout.justify-center(raw wrap)
            v-flex(xs12 md9)
                v-card(v-if="posts.length !== 0" v-for="post in posts" :key="post.pid")
                    post-card-container(v-if="!loading && !failed" :post="post" readingPost)
</template>

<script>
//import PostCard from '@/components/post-list/PostCard.vue';
import PostCardContainer from '@/components/post-list/PostCardContainer.vue';
import UserApi from '@/services/user';
import PostApi from '@/services/posts';

export default {
    props: ['ID'],
    components:{
        'post-card-container' : PostCardContainer
    },
    data(){
        return{
            page: 1,
            postloading: true,
            repliesLoading: true,
            repliesFailed: true,
            portrait: '',
            IDdata: this.ID || null,
            nickname: '',
            posts: {},
            readingPost: {
                type: Boolean,
                default: true
            }
        }
    },
    created(){
        this.getPostsByid(2);
    },
    computed:{
        loading(){ return this.postloading || this.repliesLoading; },
        failed(){ return this.repliesFailed}
    },
    watch:{
        page(){
            this.getPostsByid(2);
        }
    },
    methods:{
        async getPostsByid(uid){
            this.postloading = true;
            if(uid != null){
                const response = await UserApi.getUserPosts(uid);
                if(response.data.success){
                    this.posts = response.data.data;
                    this.postloading = false;
                    for(var i=0; i < this.posts.length;i++){
                        this.fetchReplies(this.posts[i].pid, this.posts[i], i);
                    }
                } else{
                    window.alert('get user posts failed');
                }
            }
        },
        //add tag to make sure fetch all replies at first then make post-card-container
        async fetchReplies(pid, post, tag) {
            this.repliesLoading = true;
            var res = await PostApi.getReplies(pid, this.page);
            this.repliesLoading = false;
            if(res.data.success) {
                post.replies = res.data.data;
                if(tag == this.posts.length - 1){
                    this.repliesFailed = false;
                }
            } else {
                this.repliesFailed = true;
                window.alert('获取回复数据失败');
            }
        },
    }
}
</script>
