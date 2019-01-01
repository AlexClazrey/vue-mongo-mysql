<template lang="pug">
v-card.pa-4(flat tile)
  post-card(:post="post" :isReply="false" :isLastReply="false" :readingPost="readingPost")
  v-card.mt-2(flat)
    v-layout(row)
      v-flex(xs2 md1 v-if="hasReply")
        v-card-actions
          v-btn(large icon flat color="red accent-3")
            v-icon(large) arrow_upward
        v-card-actions
          v-btn(large icon flat color="yellow darken-3")
            v-icon(large) arrow_downward
      v-flex(xs4 md2 v-else)
        v-card-actions
          v-btn(large icon flat color="red accent-3")
            v-icon(large) arrow_upward
          v-btn(large icon flat color="yellow darken-3")
            v-icon(large) arrow_downward
      v-flex(xs10 md11 v-if="hasReply")
        // TODO add "and xxx more posts..." info
        post-card.mt-1(
          v-for="reply, index in post.replies", :key="reply.c_pid",
          :post="reply", :isReply="true", :isLastReply="index < post.replies.length - 1",
          :readingPost="readingPost")
        v-card.mt-1.px-3.py-2(flat v-if="post.replies.length < post.repliesCount")
          v-card(flat style="display: inline-block;" route :to="{name: 'read-post', params: {pid: post.pid}}")
            span.my-0(style="font-size: 18px;") and {{ post.repliesCount - post.replies.length }} more replies...
      v-flex(xs6 md8 v-else)
        v-card.px-2.pt-3(flat)
          p(style="font-size: 18px;") No replies yet.
</template>

<script>
import PostCard from './PostCard.vue';
export default {
  name: 'PostCardContainer',
  props: {
      post: Object,
      readingPost: {
        type: Boolean,
        default: false, 
      },
  },
  components: {
      'post-card': PostCard,
  },
  computed: {
    hasReply() {
      return this.post.replies.length > 0;
    }
  }
}
</script>
