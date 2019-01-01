<template lang="pug">
v-layout(row wrap)
  v-flex(xs12 md9)
    v-card.px-4.py-2.blue-grey.lighten-5(flat)
      v-layout(row wrap)
        v-flex(xs12 sm12 md4)
          v-btn.red.darken-2.white--text(block flat @click="()=>{failed ? refresh() : firstPage() }")
            v-icon(v-if="!failed" left) first_page
            span(v-if="!failed") first page
            v-icon(v-if="failed" left) refresh
            span(v-if="failed") refresh
        v-flex(:class="{'pl-3': $vuetify.breakpoint.mdAndUp }" xs6 sm6 md4 lg3)
          v-btn(color="grey darken-3 white--text", block, flat, :disabled="page==1", @click="previousPage")
            v-icon(left) chevron_left
            span previous page
        v-flex.pl-3(xs6 sm6 md4 lg3)
          v-btn(color="grey darken-3 white--text", block flat, :disabled="empty" @click="nextPage") 
            v-icon(left) chevron_right
            span next page
  v-flex(xs12 md3 align-center)
    v-card.py-2.px-3.pink.lighten-5(flat)
      v-btn.pink.white--text(block flat @click="addPost")
        v-icon(left) add_circle_outline
        span add post    
</template>

<script>
export default {
  props: {
    page: Number,
    failed: Boolean,
    empty: Boolean,
  },
  methods: {
    firstPage() { this.updatePage(1); },
    previousPage() { this.updatePage(this.page > 1 ? --this.page : this.page); },
    nextPage() { this.updatePage(this.empty ? this.page : ++this.page); },
    addPost() {},
    updatePage(page) { this.$emit('page', page); },
    refresh() { this.$emit('refresh'); },
  }
}
</script>
