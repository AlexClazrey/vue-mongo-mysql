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
        v-card.transparent(flat router :to="{name: 'user-page', params: {uid: post.uid}}")
          p.ml-1.mt-0.mb-2(:style="{'font-size': isReply ? '16px' : '20px', display: 'inline-block'}") {{ post.nickname }}
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
        v-menu(offset-y)
          v-btn(flat color="red" small slot="activator" :loading="menuLoading")
            v-icon menu
          v-list.red
            v-list-tile(v-for="(item, index) in menuItems" :key="index", @click="item.callback(postId)")
              v-list-tile-action
                v-icon.white--text(style="margin: 0 auto;") {{ item.icon }}
              v-list-tile-title(v-if='item.title') {{ item.title }}
        v-btn(flat color="blue" small v-if="!readingPost || isSearch" router :to="{name:'read-post', params:{ pid: post.p_pid || parentId }}")
          v-icon arrow_forward
        v-btn(flat color="teal" small v-if="!isReply && !isSearch" router :to="{name:'reply-post', params:{ rpid: post.p_pid || post.pid }}")
          v-icon reply
    v-flex(xs2)
      v-btn(flat small color="red" :disabled="!post.hot" v-if="!isReply")
        v-icon(color="red" left) whatshot
        span {{ post.hits }}
</template>

<script>
import postApi from '@/services/posts';

export default {
  name: "PostCard",
  props: {
    post: Object,
    isReply: Boolean,
    isLastReply: Boolean, // unused
    isSearch: { type: Boolean, default: false },
    readingPost: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuItems: [
        {title: '', icon:'favorite', callback: this.addToFav }
      ],
      menuLoading: false,
    }
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
      return this.readingPost ? this.post.content : this.post.content.substr(0, 300);
    },
    postId() {
      return this.isReply ? this.post.c_pid : this.post.pid;
    },
    parentId() {
      return this.isReply ? this.post.p_pid : this.post.pid;
    }
  },
  methods: {
    async addToFav(pid) {
      if(!this.$store.getters.uid) {
        alert('You need to login first.');
        return;
      }
      this.menuLoading = true;
      postApi.addFav(pid, this.$store.getters.uid);
      this.menuLoading = false;
    }
  }
}
</script>
