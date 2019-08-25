<template>
  <div id="app">
    <!-- Basic nav -->
    <!-- <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>-->

    <!-- My nav -->
    <!-- <NavBar id="nav"/> -->

    <NavBar2 id="nav" />
    <router-view />
  </div>
</template>
firebaseConfig
<script>
import NavBar from "@/components/NavBar.vue";
import NavBar2 from "@/components/NavBar2.vue";

export default {
  components: {
    NavBar,
    NavBar2
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
