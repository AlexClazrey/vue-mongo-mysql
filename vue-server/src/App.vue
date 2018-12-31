<template>
  <v-app class="white">
    <v-toolbar flat class="amber lighten-4">
      <header class="main-header">
        <v-toolbar-title class="headline text-uppercase">
          <span>BeForum</span>
          <span class="font-weight-light"> BETA</span>
        </v-toolbar-title>
      </header>
      <v-spacer></v-spacer>
      <nav class="main-nav">
        <v-btn v-for="navitem in navFilted" :key="navitem.name" 
          :to="navitem.to ? navitem.to : '' " 
          @click="navitem.click ? navClick(navitem.click) : undefined"
          flat>
            {{ navitem.name }}
        </v-btn>
      </nav>
    </v-toolbar>
    <v-content class="main-content">
      <router-view />
    </v-content>
    <v-footer class="main-footer" color="#3a3737" dark absolute height="auto">
      <v-card class="flex" color="#3a3737" flat tile>
        <v-card-actions class="justify-center">
          <p>Copyright &copy; 2018 BeForum</p>
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
    components: {
    },
    data() {
      return {
      }
    },
    computed: {
      navList() { return this.$store.getters.navList; },
      navFilted() {
        return this.navList.filter(item => this.visibleCalculate(item.visible));
      },
    },
    created: function () {
      this.$store.dispatch('pageLoad');
    },
    methods: {
      navClick(clickCallback) {
        clickCallback(this.$store);
      },
      visibleCalculate(visible) {
        if(typeof visible === 'undefined') {
          return true;
        } else if(visible instanceof Function) {
          return visible(this.$store);
        } else {
          return visible;
        }
      },
    },
  }
</script>
<style>
  .main-nav button {
    color: #111;
    text-decoration: none;
  }

  .main-footer {
    text-align: center;
  }
  
  .main-content {
    margin-bottom: 150px;
  }

  .main-footer {
    padding-top: 30px;
    padding-bottom: 20px;
    font-size: 16px;
  }

</style>