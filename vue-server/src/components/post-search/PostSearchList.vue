<template lang="pug">
v-card.py-3.amber.lighten-5(:class="{'px-2':$vuetify.breakpoint.smAndDown, 'px-4': $vuetify.breakpoint.mdAndUp}" flat)
  post-pager(:page="page" :failed="failed" :empty="noNext" :noAddButton="true" @page="updatePage")
  post-card(v-for="post in posts" :key="post.pid" :isSearch="true" :post="post")
  v-card(flat tile v-if="loading")
    p.pl-4.headline Loading Post...
  v-card(flat tile v-if="failed")
    p.pl-4.headline Server Busy...
  post-pager(:page="page" :failed="failed" :empty="noNext" :noAddButton="true" @page="updatePage")
</template>

<script>
import PostCard from '../post-list/PostCard.vue';
import PostPager from '../post-list/PostPager.vue';
import PostApi from '@/services/posts';

export default {
    props: ['keyword'],
    components: {
        'post-pager': PostPager,
        'post-card': PostCard,
    },
    data() {
        return {
            posts: [],
            page: 1,
            contentLoading: true,
            contentFailed: false,
        }
    },
    computed: {
        loading() { return this.contentLoading },
        failed() { return this.contentFailed },
        pageSize() { return this.$store.state.posts.postsCountOnOnePage; },
        noNext() { return this.posts.length < this.pageSize; }
    },
    created() {
        this.fetchSearch();
    },
    methods: {
        async fetchSearch() {
            this.contentLoading = true;
            var res = await PostApi.search(this.keyword);
            this.contentLoading = false;
            if(res.data.success == true) {
                this.contentFailed = false;
                this.posts.push(...res.data.data);
            } else {
                this.contentFailed = true;
                alert('获取搜索结果失败');
            }
        },
        async updatePage(page) {
            this.page = page;
        }
    }
}
</script>