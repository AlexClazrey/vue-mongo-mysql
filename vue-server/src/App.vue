<template>
  <v-app>
    <v-toolbar color="rgb(255, 177, 181)" app>
      <header class="main-header">
        <v-toolbar-title class="headline text-uppercase">
          <span>BeForum</span>
          <span class="font-weight-light">BETA</span>
        </v-toolbar-title>
      </header>
      <v-spacer></v-spacer>
      <nav class="main-nav">
        <v-btn v-for="navitem in navList" :key="navitem.name" :to="navitem.to" flat>
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
  import HelloWorld from './components/HelloWorld'

  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    data() {
      return {
      }
    },
    computed: {
      navList() { return this.$store.getters.navList; }
    },
    mounted: function () {
      this.$store.dispatch('refreshBoards');
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
    margin-top: 20px;
    margin-bottom: 200px;
  }

  .main-footer {
    padding-top: 30px;
    padding-bottom: 20px;
    font-size: 16px;
  }

</style>