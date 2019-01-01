<template lang="pug">
v-card.px-4.py-3(flat)
  v-layout(row wrap)
    v-flex(xs12)
      p.mt-2.mb-1 {{ description }}
    v-flex(xs12 v-if="selectBoard")
      v-card
        select.px-3.py-2.title(v-model="selectData", style="display:block; width: 100%;")
          option(value="0" disabled selected) Select a board...
          option(v-for="board in boards" :key="board.id" :value="board.id") {{ board.name }}
    v-flex(xs12)
      v-card.mt-3
        input.px-3.py-2.title(v-model="titleData", placeholder="Post Title", style="display: block; width: 100%;")
    v-flex(xs12)
      v-textarea.mt-3(solo, v-model="contentData", placeholder="Post Content")
    v-flex(xs8)
      v-card-actions.pl-0
        v-btn(dark color="teal lighten-1" block large depressed @click="save" :loading="loading") Save
    v-flex(xs4)
      v-card-actions.pr-0
        v-btn(dark color="blue darken-1" block large depressed @click="submit" :loading="loading") Submit
</template>

<script>
export default {
  props: ['title', 'content', 'description', 'selectBoard', 'loading'],
  data() {
    return {
      titleData: this.title || '',
      contentData: this.content || '',
      selectData: 0,
    }
  },
  computed: {
    post() {
      return {
        bid: this.selectData,
        title: this.titleData,
        content: this.contentData,
      }
    },
    boards() {
      return this.$store.getters.boards;
    }
  },
  methods: {
    save() {
      this.$emit('save', this.post)
    },
    submit() {
      this.$emit('submit', this.post)
    }
  }
}
</script>
