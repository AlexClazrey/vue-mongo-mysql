<template lang="pug">
v-card.transparent(flat style="max-width: 1300px; margin: 0 auto;")
  v-container.mt-4
    h1.display-2 Post {{'#' + pid}}
    post-reader.mt-4(:pid="pid")
</template>

<script>
import PostReader from '@/components/post-read/PostReader.vue'

// TODO if child >> get parent pid
export default {
  name: 'PostRead',
  components: {
    'post-reader': PostReader
  },
  computed: {
    pid() {
      return this.$route.params.pid;
    }
  }
}
</script>
