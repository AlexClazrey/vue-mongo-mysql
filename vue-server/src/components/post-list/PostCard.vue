<template lang="pug">
v-card.lighten-5.py-1.px-3()
  v-layout(row wrap)
    v-flex(xs8)
      v-card-title.pb-1
        h3.headling {{ post.title }}
    v-flex(xs4)
      v-card-title.pb-1
        p.my-0 {{ post.nickname }}
    v-flex(xs8)
      v-card-text.my-0.py-0
        p.my-0.caption {{ new Date(post.commit_time).toLocaleString() }}
    v-flex(xs4)
      v-card-text.my-0.py-0(v-if="!isReply")
        p.my-0.caption {{ addon }}
    v-flex(xs12)
      v-card-text.pt-2
        p {{ contentPreview }}
    v-flex(xs10)
      v-btn(flat color="red" small)
        v-icon menu
      v-btn(flat color="blue" small)
        v-icon arrow_forward
    v-flex(xs2)
      v-btn(flat small color="red" :disabled="!post.hot" v-if="!isReply")
        v-icon(color="red" left) whatshot
        span {{ post.hits }}
</template>

<script>
export default {
  name: "PostCard",
  props: {
    post: Object,
    isReply: Boolean,
    isLastReply: Boolean,
  },
  computed: {
    addon() {
      var res = [];
      if(this.post.top) res.push('TOP');
      if(this.post.pick) res.push('PICK');
      if(this.post.protect) res.push('PROTECT');
      return res.join(' | ');
    },
    contentPreview() {
      return this.post.content.substr(0, 300);
    }
  }
}
</script>
