<template lang="pug">
v-container
  v-toolbar.teal.lighten-5(flat)
    v-layout(row wrap justify-space-around)
      v-flex(xs2 v-for="board in boards" :key="board.id") 
        v-btn.teal.lighten-1.white--text(block flat) {{ board.name }}
  v-router
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  computed: {
    ...mapGetters(['boards'])
  }    
}
</script>
