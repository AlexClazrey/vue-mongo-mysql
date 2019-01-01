<template lang="pug">
v-card.py-3.amber.lighten-5(:class="{'px-2':$vuetify.breakpoint.smAndDown, 'px-4': $vuetify.breakpoint.mdAndUp}" flat)
  post-pager(:page="page" :failed="failed" :empty="noNext" :bid="bid" @page="updatePage" @refresh="fetchPosts")
  v-layout(row wrap)
    v-flex(xs12)
      v-card(flat tile).px-3.pb-1.pt-2
        p.ml-3.mt-4.mb-0.display-1 {{ boardName }}
    v-flex(xs12 v-if="!loading && !failed" v-for="post in posts" :key="post.pid")
      post-card-container(:post="post")
    v-flex(xs12 v-if="loading")
      v-card(flat tile).px-3.pb-1.pt-2
        p.pl-4.headline Loading Posts...
    v-flex(xs12 v-if="failed")
      v-card(flat tile).px-3.pb-1.pt-2
        p.pl-4.headline Server Busy...
    v-flex(xs12 v-if="empty")
      v-card(flat tile).px-3.pb-1.pt-2
        p.pl-4.headline No posts here.
  post-pager(:page="page" :failed="failed" :empty="noNext" :bid="bid" @page="updatePage" @refresh="fetchPosts")
</template>

<script>
import PostCardContainer from './PostCardContainer.vue';
import PostPager from './PostPager.vue';
import PostApi from '@/services/posts';

export default {
  components: {
    'post-card-container': PostCardContainer,
    'post-pager': PostPager,
  },
  name: 'PostLister',
  data() {
    return {
      page: 1,
      posts: [],
      loading: true,
      failed: false,
      empty: false,
    }
  },
  computed: {
    bid() {
      return this.$route.params && parseInt(this.$route.params.bid) || 0;
    },
    noNext() {
      return this.posts.length < this.$store.state.posts.postsCountOnOnePage;
    },
    boardName() {
      var bid = this.bid;
      if(this.bid == 0) 
        return 'All Boards';
      var board = this.$store.getters.boards.filter(x => x.id == bid)[0]
      return board ? board.name : null;
    }
  },
  watch: {
    bid() {
      this.fetchPosts();
    },
    page() {
      this.fetchPosts();
    }
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      this.loading = true;
      this.failed = false;
      this.empty = false;
      var res = await PostApi.fetchPosts(this.bid, this.page);
      this.loading = false;
      if(res.data && res.data.success) {
        this.posts = res.data.data;
        if(this.posts.length === 0)
          this.empty = true;
      } else {
        this.failed = true;
      }
    },
    updatePage(page) {
      this.page = page;
    }
  }
}
</script>
