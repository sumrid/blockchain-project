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
    <transition name="fade">
      <router-view />
    </transition>
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
  /* text-align: center; */
  color: #3c5369;
}

#nav a.router-link-exact-active {
  color: #4ab486;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
