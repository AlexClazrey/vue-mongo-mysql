<template lang="pug">
v-card.white.py-1.px-3()
  v-layout(row wrap)
    v-flex(xs12)
      v-card-title.pb-1
        h3.title {{ post.title }}
    v-flex(xs12)
      v-card-text.my-0.py-0
        p.my-0.caption {{ new Date(time).toLocaleString() }}
    v-flex(xs12)
      v-card-text.pt-2
        p {{ contentPreview }}
    v-flex(xs12)
      v-card-actions
        v-btn(flat color="blue" small v-if="!draft" router :to="{name:'read-post', params:{ pid: parentId }}")
          v-icon arrow_forward
        v-btn(flat color="blue" small v-if="draft" router :to="{name:'edit-post', params:{epid: postId }}")
          | edit
</template>

<script>
export default {
  name: "SimplePostCard",
  props: {
    post: Object,
    draft: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    contentPreview() {
      return this.post.content.substr(0, 300);
    },
    postId() {
      return this.post.pid;
    },
    parentId() {
      return this.post.p_pid || this.post.pid;
    },
    time() {
      return this.post.created_time || this.post.commit_time;
    }
  }
}
</script>
