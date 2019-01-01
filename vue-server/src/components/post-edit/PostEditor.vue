<template lang="pug">
v-card.px-4.py-3(flat)
  v-layout(row wrap)
    v-flex(xs12)
      p {{ description }}
    v-flex(xs12)
      v-card
        input.px-3.py-2.headline(v-model="titleData", placeholder="Post Title", style="display: block; width: 100%;")
    v-flex(xs12)
      v-textarea.mt-3(solo, v-model="contentData", placeholder="Post Content")
    v-flex(xs8)
      v-card-actions.pl-0
        v-btn(dark color="brown darken-1" block large depressed @click="save") Save
    v-flex(xs4)
      v-card-actions.pr-0
        v-btn(dark color="blue darken-1" block large depressed @click="submit") Submit
</template>

<script>
export default {
  props: ['title', 'content', 'description'],
  data() {
    return {
      titleData: this.title || '',
      contentData: this.content || '',
    }
  }, 
  methods: {
    save() {

    },
    submit() {

    }
  }
}
</script>
