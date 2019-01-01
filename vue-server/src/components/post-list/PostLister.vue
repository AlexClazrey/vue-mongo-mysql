<template lang="pug">
v-layout(row wrap)
  // TODO add icons
  v-flex.px-4(xs12 md9)
    v-layout(row wrap)
      v-flex.pr-3(xs12 sm6 md4)
        v-btn.blue.darken-4.white--text(block flat)
          v-icon(left) first_page
          span first page
      v-flex.pr-3(xs6 sm3 md4 lg3)
        v-btn.grey.darken-2.white--text(block flat)
          v-icon(left) chevron_left
          span previous page
      v-flex(xs6 sm3 md4 lg3)
        v-btn.grey.darken-2.white--text(block flat) 
          v-icon(left) chevron_right
          span next page
  v-flex.px-4(xs12 md3 align-center)
    v-btn.pink.white--text(block flat)
      v-icon(left) add_circle_outline
      span add post
  v-flex.mt-4.px-4(xs12 v-if="!loading" v-for="post in posts" :id="post.pid")
    post-card(:post="post")
  v-flex.mt-4.px-4(xs12 v-if="loading")
    p.headline Loading Posts...
</template>

<script>
import PostCard from './PostCard.vue';

export default {
  components: {
    'post-card': PostCard,
  },
  data() {
    return {
      page: 1,
      posts: [],
      loading: true,
    }
  },
  computed: {
    bid() {
      return this.$router.params && this.$router.params.bid || 0;
    } 
  },
  mounted() {

  },
  methods: {
    fetchPosts() {

    }
  }
}
</script>
