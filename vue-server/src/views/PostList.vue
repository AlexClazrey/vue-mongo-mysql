<template lang="pug">
v-card.transparent(flat style="max-width: 1300px; margin: 0 auto;")
  v-container.mt-2
    //- board selector
    v-layout.px-4.py-1.teal.lighten-5(row wrap)
      v-flex.px-1(xs12 sm4 lg2)
        v-btn.white--text(block color="teal lighten-1" depressed router :to="{name: 'all-posts'}" exact) 
          v-icon(left) all_inclusive
          span All Boards
      v-flex.px-1(xs6 sm4 lg2 v-for="board in boards" :key="board.id") 
        v-btn.white--text(block color="teal lighten-1" depressed router :to="{name: 'board-posts', params: {bid: board.id}}" exact)
          v-icon(left) view_list
          span {{ board.name }}
    //- search box
    v-layout.px-4.py-1.blue.lighten-5(row wrap)
      v-flex(xs12 md10)
        v-card.my-1.mr-3(flat style="background-color: transparent")
          input.px-3.py-2(v-model="keyword", placeholder="Search keyword...", style="display: block; width: 100%; height: 40px")
      v-flex(xs12 md2)
        v-btn.white--text(block color="blue lighten-1" depressed router :to="{name: 'post-search', params: {keyword: keyword}}" exact style="")
          span SEARCH POST
    router-view.mt-3
</template>

<script>
export default {
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
    }
  }
}
</script>
