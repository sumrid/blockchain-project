<template>
  <div id="app">
    <NavBar2 id="nav" />
    
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>
import NavBar2 from "@/components/NavBar2.vue";

export default {
  components: {
    NavBar2
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Prompt&display=swap');

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #3c5369;
  font-family: 'Prompt', sans-serif;
  margin-top: 3.5rem;
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
