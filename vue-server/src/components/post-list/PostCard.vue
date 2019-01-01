<template lang="pug">
v-card.white.lighten-5.py-1.px-3()
  v-layout(row wrap)
    v-flex(xs8)
      v-card-title.pb-1
        h3(:class="{headline: !isReply, subheading: isReply}") {{ post.title }}
    v-flex(xs4)
      v-layout(fill-height align-end)
        v-avatar(tile :size="isReply ? '36' : '48'" style="display: inline-block")
          img(v-if="post.protrait")
          v-icon(v-if="!post.protrait" :large="!isReply") person
        p.ml-1.mt-0.mb-1(:style="{'font-size': isReply ? '16px' : '20px', display: 'inline-block'}") {{ post.nickname }}
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
      v-card-actions
        v-btn(flat color="red" small)
          v-icon menu
        v-btn(flat color="blue" small v-if="!isReply" router :to="{name:'read-post', params:{ pid: post.pid }}")
          v-icon arrow_forward
        v-btn(flat color="teal" small v-if="!isReply" router :to="{name:'reply-post', params:{ rpid: post.pid }}")
          v-icon reply
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
