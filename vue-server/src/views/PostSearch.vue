<template lang="pug">
v-card.transparent(flat style="max-width: 1300px; margin: 0 auto;")
  v-container.mt-4
    h1.display-2.mb-3 Post Search Result for "{{keyword}}"
    post-search-list.mt4(:keyword="keyword")
</template>

<script>
import PostSearchList from '@/components/post-search/PostSearchList.vue'

export default {
  name: 'PostSearch',
  components: {
    'post-search-list': PostSearchList
  },
  computed: {
    keyword() {
       return this.$route.params.keyword; 
    }
  }
}
</script>