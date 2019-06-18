<template lang="pug">
v-card.py-3.amber.lighten-5(:class="{'px-2':$vuetify.breakpoint.smAndDown, 'px-4': $vuetify.breakpoint.mdAndUp}" flat)
  reply-pager(:page="page" :failed="failed" :empty="noNext" :pid="pidNumber" @page="updatePage")
  post-card-container(v-if="!loading && !failed" :post="post" readingPost)
  v-card(flat tile v-if="loading")
    p.pl-4.headline Loading Post...
  v-card(flat tile v-if="failed")
    p.pl-4.headline Server Busy...
  reply-pager(:page="page" :failed="failed" :empty="noNext" :pid="pidNumber" @page="updatePage")
</template>

<script>
import PostCardContainer from '../post-list/PostCardContainer.vue';
import ReplyPager from './ReplyPager.vue';
import PostApi from '@/services/posts';

export default {
  props: ['pid'],
  components: {
    'reply-pager': ReplyPager,
    'post-card-container': PostCardContainer    
  },
  data() {
    return {
      page: 1, // TODO unused in reading 
      post: {},
      repliesLoading: true,
      contentLoading: true,
      repliesFailed: false,
      contentFailed: false,
    }
  },
  computed: {
    noNext() {
      return this.loading || this.failed || this.post.replies && this.post.replies.length < this.$store.state.posts.repliesCountOnOnePage;
    },
    loading() { return this.repliesLoading || this.contentLoading; },
    failed() { return this.repliesFailed || this.contentFailed; },
    pidNumber() { return parseInt(this.pid); },
  },
  created() {
    this.fetchPostContent();
    this.fetchReplies();
  },
  watch: {
    page() {
      this.fetchReplies();
    }
  },
  methods: {
    async fetchPostContent() {
      this.contentLoading = true;
      var res = await PostApi.getPost(this.pid);
      this.contentLoading = false;
      if(res.data.success) {
        this.contentFailed = false;
        Object.assign(this.post, res.data.data);
      } else {
        this.contentFailed = true;
        alert('获取帖子内容失败');
      }
    },
    async fetchReplies() {
      this.repliesLoading = true;
      var res = await PostApi.getReplies(this.pid, this.page);
      this.repliesLoading = false;
      if(res.data.success) {
        this.repliesFailed = false;
        this.post.replies = res.data.data;
      } else {
        this.repliesFailed = true;
        alert('获取回复数据失败');
      }
    },
    updatePage(page) {
      this.page = page;
    }
  }
}
</script>
