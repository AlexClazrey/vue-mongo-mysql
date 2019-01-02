<template lang="pug">
v-card.transparent(flat style="max-width: 960px; margin: 0 auto;")
  v-container.mt-4
    h1.display-2 {{ heading }}
    post-editor.mt-4(
      :title='title',
      :content='content', 
      :description='editorDesc',
      :selectBoard="selectBoard",
      :loading="loading",
      @save="savePost",
      @submit="submitPost")
</template>

<script>
import PostEditor from '@/components/post-edit/PostEditor.vue';
import postApi from '@/services/posts';
import apiUtil from '@/services/util';
import {mapGetters} from 'vuex';
import $ from 'jquery';
require('jquery.cookie');


export default {
  name: 'PostEditView',
  components: {
    'post-editor': PostEditor,
  },
  data() {
    return {
      title: '',
      content: '',
      loading: false,
      newPid: null,
    }
  },
  computed: {
    ...mapGetters(['badAuth', 'badPrivilege']),
    target() {
      var par = this.$route.params;
      return {
        bid: parseInt(par.bid),
        epid: parseInt(par.epid),
        rpid: parseInt(par.rpid),
      }
    },
    heading() {
      if(this.target.rpid) return "Reply Post";
      if(this.target.epid) return "Edit Post";
      if(this.target.bid) return "Add Post";
      return "Add Post";
    },
    editorDesc() {
      if(this.target.rpid) return "You are now replying post #" + this.target.rpid + '.';
      if(this.target.epid) return "You are now editing post #" + this.target.epid + '.';
      if(this.target.bid > 0) { 
        // search for board name
        var boardName = this.$store.getters.boards.filter(b => b.id == this.target.bid)[0];
        // check if null
        if(boardName)
          boardName = boardName.name;
        return `You are now adding post to board "${boardName}".`;
      }
      return 'You need to choose a board to post.'
    },
    selectBoard() {
      return !(this.target.rpid || this.target.epid || this.target.bid > 0);
    },
  },
  created() {
    this.checkLogin();
    this.fetchPost(this.target.epid);
  },
  watch: {
    badAuth(val) {
      if(val) {
        alert('登录信息失效，无法保存帖子的内容，请手动复制内容到其他程序之后重新登录。');
      }
    },
    badPrivilege(val) {
      if(val) {
        alert('你没有权限在此编辑内容，内容将不会保存。');
      }
    }
  },
  methods: {
    checkLogin() {
      // 如果是刷新页面的话这个时候store的请求还没有收到结果，所以先用cookies做判断
      if(!$.cookie('uid')) {
        // alert you need to login first
        alert('You need to login.');
        // 为了能够在登录界面后退到帖子界面
        this.$router.replace({name: 'login'});
      }
    },
    async fetchPost(pid) {
      if(pid) {
        this.loading = true;
        var res = await postApi.getPostContent(pid);
        this.loading = false;
        if(res.data && res.data.success) {
          this.title = res.data.data.title;
          this.content =  res.data.data.content;
        } else {
          alert('载入帖子内容失败，请刷新页面重试');
        }
      }
    },
    async savePost(post) {
      // prepare post request content
      post.uid = this.$store.getters.uid;
      if(!post.uid) {
        alert('登录信息失效，无法保存帖子的内容，请手动复制内容到其他程序之后重新登录。');
        return null;
      }
      this.loading = true;
      if(this.newPid) {
        post.pid = this.newPid;
      }
      if(this.target.epid) {
        post.pid = this.target.epid;
      } else if(this.target.rpid) {
        post.isReply = true; 
        post.pPid = this.target.rpid;
      } else if(this.target.bid) {
        post.isReply = false;
        post.bid = this.target.bid;
      } else {
        // use bid from PostEditor
        post.isReply = false;
      } 
      // submit save request
      var res = await postApi.saveDraft(post);
      res = apiUtil.resAuthCheck(res, this);
      this.loading = false;
      if(res) {
        this.newPid = res.pid;
        return this.newPid;
      } else {
        alert('保存失败，请重试');
        return null;
      }
    },
    async submitPost(post) {
      if(!await this.savePost(post)) {
        // 所有返回了null的都已经给出了alert
        return;
      }
      this.loading = true;
      var pid = this.newPid || this.target.epid;
      var res = await postApi.commitPost({
        uid: this.$store.getters.uid,
        pid: pid,
      });
      res = apiUtil.resAuthCheck(res, this);
      this.loading = false;
      if(res) {
        alert('提交成功');
        this.$router.go(-1);
      }
    }
  }
}
</script>
