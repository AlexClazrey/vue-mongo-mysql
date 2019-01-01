<template lang="pug">
v-card.pa-4(flat)
  post-card(:post="post" :isReply="false" :isLastReply="false")
  v-card.mt-2(flat)
    v-layout(row)
      v-flex(xs2 md1)
        v-card-actions
          v-btn(large icon flat color="red accent-3")
            v-icon(large) arrow_upward
        v-card-actions
          v-btn(large icon flat color="yellow darken-3")
            v-icon(large) arrow_downward
      v-flex(xs10 md11)
        post-card.mt-1(
          v-for="reply, index in post.replies", :key="reply.c_pid",
          :post="reply", :isReply="true", :isLastReply="index < post.replies.length - 1")
</template>

<script>
import PostCard from './PostCard.vue';
export default {
  name: 'PostCardContainer',
  props: {
      post: Object,
  },
  components: {
      'post-card': PostCard,
  }
}
</script>
