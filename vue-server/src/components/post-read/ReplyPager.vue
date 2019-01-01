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
        v-flex(:class="{'pl-3': $vuetify.breakpoint.mdAndUp }" xs12 sm12 md8)
          v-layout(row fill-height align-center)
            v-flex(xs5 lg4)
              v-btn(color="grey darken-3 white--text", block, flat, :disabled="page==1", @click="previousPage")
                span previous page
                v-icon(right) chevron_left
            v-flex(xs2 lg1)
              p.grey--text.text--darken-3.title.my-0.ml-3.pl-1(style="text-align: center;") {{ page }}
            v-flex(xs5 lg4)
              v-btn(color="grey darken-3 white--text", block, flat, :disabled="empty" @click="nextPage") 
                v-icon(left) chevron_right
                span next page
  v-flex(xs12 md3 align-center)
    v-card.py-2.px-3.green.lighten-5(flat)
      v-btn.green.white--text(block flat :to="{name: 'reply-post', params: {rpid: pid}}")
        v-icon(left) reply
        span reply    
</template>

<script>
export default {
  props: {
    page: Number,
    failed: Boolean,
    empty: Boolean,
    pid: Number,
  },
  methods: {
    firstPage() { this.updatePage(1); },
    previousPage() { this.updatePage(this.page > 1 ? this.page - 1 : this.page); },
    nextPage() { this.updatePage(this.empty ? this.page : this.page + 1); },
    updatePage(page) { this.$emit('page', page); },
    refresh() { this.$emit('refresh'); },
  }
}
</script>
