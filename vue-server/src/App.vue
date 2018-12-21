<template>
  <div id="app">
    <header class="main-header">
      <div class="container">
        <h1>BeForum</h1>
      </div>
    </header>
    <nav class="main-nav">
      <div class="container">
        <router-link to="/">Home</router-link> |
        <router-link to="/boards">Forum</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/login">Login</router-link>
      </div>
    </nav>
    <main>
      <router-view/>
    </main>
    <footer class="main-footer">
      <p>Copyright &copy; 2018 BeForum</p>
    </footer>
  </div>
</template>

<script>
export default {
  mounted: function() {
      this.$store.dispatch('refreshBoards');
  },
}

</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
}
body {
  margin: 0;
}
.container {
  max-width: 960px;
  min-width: 500px;
  margin: 0 auto;
}
.main-header {
  background: rgb(255, 116, 123);
  padding-top: 20px;
  padding-bottom: 10px;
  color: rgb(255, 255, 255);
  overflow: hidden;
}
.main-header h1 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.1em;
  font-size: 40px;
}
.main-nav {
  background: #5a4949;
  color: rgb(255, 247, 251);
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 50px;
  font-size: 20px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.main-nav a {
  color: rgb(255, 247, 251);
  text-decoration: none;
}
.main-footer {
  background: #3a3737;
  color: #fff;
  text-align: center;
  bottom: 0;
  width: 100%;
  padding-top: 40px;
  padding-bottom: 30px;
  margin-top: 40px;
  overflow: hidden;
}
</style>
