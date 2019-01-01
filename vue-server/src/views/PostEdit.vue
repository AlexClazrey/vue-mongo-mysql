<template lang="pug">
v-card.transparent(flat style="max-width: 960px; margin: 0 auto;")
  v-container.mt-4
    h1.display-2 {{ heading }}
    post-editor.mt-4(:title='title', :content='content', :description='editorDesc')
</template>

<script>
import PostEditor from '@/components/post-edit/PostEditor.vue';

export default {
  name: 'PostEditView',
  components: {
    'post-editor': PostEditor,
  },
  data() {
    return {
      title: '',
      content: '',
      loading: true,
    }
  },
  computed: {
    heading() {
      var par = this.$route.params;
      if(par.rpid) return "Reply Post";
      if(par.epid) return "Edit Post";
      if(par.bid) return "Add Post";
      return "Add Post";
    },
    editorDesc() {
      var par = this.$route.params;
      if(parseInt(par.rpid)) return "You are now replying to post #" + par.rpid + '.';
      if(parseInt(par.epid)) return "You are now editing post #" + par.epid + '.';
      if(parseInt(par.bid) > 0) { 
        var boardName = this.$store.getters.boards.filter(b => b.id == parseInt(par.bid))[0];
        if(boardName)
          boardName = boardName.name;
        return `You are now adding post to board "${boardName}".`;
      }
      return 'You need to choose a board to post.'
    },
  },
  methods: {
    checkLogin() {

    },
    fetchPost(pid) {

    }
  }
}
</script>
