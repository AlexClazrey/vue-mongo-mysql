<template lang="pug">
v-card.pt-2(flat style="max-width: 1300px; margin: 0 auto;")
  v-container
    v-card.ma-5
      v-layout(fill-height)
        v-flex(xs3)
          v-list.teal.lighten-3
            v-list-tile(v-for="link in links" :key="link.text" router :to="link.to")
              v-list-tile-action
                v-icon.white--text {{ link.icon }}
              v-list-tile-content
                v-list-tile-title.white--text {{ link.text }}
</template>

<script>
export default {
  data() {
    return {
      links: [
        { icon: 'view_stream', text: 'Posts', to: {name: ''} },
        { icon: 'vertical_split', text: 'Drafts', to: {name: ''} },
        { icon: 'favorite', text: 'Favourites', to: {name: ''} },
        { icon: 'settings', text: 'Settings', to: {name: ''} },
      ]
    }
  }
}
</script>
