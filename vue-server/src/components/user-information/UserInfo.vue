<template lang="pug">
    v-card.flat.pa-3()
        v-layout.justify-center(raw wrap)
            v-flex(xs12 md2)
                v-avatar()
                    img(src="")
            v-flex(xs12 md2)
                v-card-text.my-0.py-0
                    p.my-0.caption {{ IDdata }}
                    p.my-0.body-2 {{ nicknameData }}
        v-card(v-for="post in postsData" :key="post.id")
            post-card(:post="postsData" :isReply="false" :isLastReply="false")
</template>

<script>
import PostCard from '@/components/post-list/PostCard.vue';
export default {
    props: ['chatheads','ID','nickname','posts'],
    component:{
        'post-card' : PostCard
    },
    data(){
        return{
            chatheadsData: this.charheads || '',
            IDdata: this.ID || 1,
            nicknameData: this.nickname || 'just test',
            postsData: this.posts || [],
        }
    },
    methods:{
    }
}
</script>
